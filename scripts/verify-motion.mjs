// Drives the production build in Chrome at full and reduced motion and checks the motion layer:
// every page change runs a view transition, the product morph runs only at full motion, nothing
// logs an error, and animation phases hold their frame rate (no frame over 50ms, ~60fps average).
//
//   PORT=3100 PUBLIC_LITEKART_API_URL=https://api.litekart.in PUBLIC_LITEKART_DOMAIN=demo.litekart.in node build
//   node scripts/verify-motion.mjs            # BASE_URL defaults to http://127.0.0.1:3100
import { chromium } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3100'
// A page that lists product cards. The demo store's /products listing is empty; its homepage is not.
const START = process.env.START_PATH ?? '/'
const MAX_FRAME_MS = 50
const MIN_AVG_FPS = 55
const failures = []
const report = []

const check = (ok, label) => {
	report.push(`${ok ? 'PASS' : 'FAIL'}  ${label}`)
	if (!ok) failures.push(label)
}

// Runs in the page before the app. Records every view transition (whether the morph group
// animated, frame deltas from `ready` to `finished`) and exposes a frame sampler.
const instrument = () => {
	window.__sampleFrames = (ms) =>
		new Promise((resolve) => {
			const frames = []
			let last = performance.now()
			const stopAt = last + ms
			const tick = (now) => {
				frames.push(now - last)
				last = now
				if (now < stopAt) requestAnimationFrame(tick)
				else resolve(frames)
			}
			requestAnimationFrame(tick)
		})

	window.__vt = []
	const original = document.startViewTransition?.bind(document)
	if (!original) return
	document.startViewTransition = (update) => {
		const record = { morph: false, frames: [], done: false, error: null }
		window.__vt.push(record)
		const transition = original(update)
		transition.ready
			.then(() => {
				record.morph = document.getAnimations().some((a) => String(a.effect?.pseudoElement ?? '').includes('product-media'))
				let last = performance.now()
				const tick = (now) => {
					record.frames.push(now - last)
					last = now
					if (!record.done) requestAnimationFrame(tick)
				}
				requestAnimationFrame(tick)
			})
			.catch((e) => (record.error = String(e)))
		transition.finished.finally(() => (record.done = true))
		return transition
	}
}

const smooth = (label, frames) => {
	const usable = frames.slice(1)
	const worst = Math.round(Math.max(0, ...usable))
	const mean = usable.reduce((a, b) => a + b, 0) / Math.max(1, usable.length)
	const fps = Math.round(1000 / mean)
	check(worst <= MAX_FRAME_MS && fps >= MIN_AVG_FPS, `${label}: worst frame ${worst}ms, ${fps}fps`)
}

// Runs `action` and waits for the view transition it starts. Counting first matters: a navigation
// only calls startViewTransition once its data has loaded, so "the last record is done" would
// otherwise return the previous navigation's transition.
const transitionOf = async (page, action) => {
	const before = await page.evaluate(() => window.__vt.length)
	await action()
	await page.waitForFunction((n) => window.__vt.length > n && window.__vt.at(-1).done, before, { timeout: 15_000 })
	return page.evaluate(() => window.__vt.at(-1))
}

/** No transform, or the identity matrix a finished transition leaves behind. */
const still = (transform) => transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)'

const sameOrigin = (url) => {
	try {
		return new URL(url).host === new URL(BASE).host
	} catch {
		return true
	}
}

for (const reducedMotion of ['no-preference', 'reduce']) {
	const browser = await chromium.launch({ channel: 'chrome' })
	const context = await browser.newContext({ reducedMotion, viewport: { width: 1280, height: 900 } })
	const page = await context.newPage()
	const errors = []
	page.on('pageerror', (e) => errors.push(e.message))
	// Third-party widgets and lookups (Trustpilot, an IP lookup this network cannot resolve) are not
	// the storefront's errors; only errors raised from the storefront's own origin count.
	page.on('console', (m) => m.type() === 'error' && sameOrigin(m.location().url) && errors.push(m.text()))
	await page.addInitScript(instrument)
	const mode = reducedMotion === 'reduce' ? 'reduced' : 'full'

	await page.goto(BASE + START, { waitUntil: 'networkidle' })

	// 1. Scrolling a page of cards.
	const scrolling = page.evaluate(() => window.__sampleFrames(2000))
	for (let i = 0; i < 40; i++) {
		await page.mouse.wheel(0, 60)
		await page.waitForTimeout(50)
	}
	smooth(`[${mode}] scroll`, await scrolling)
	await page.evaluate(() => window.scrollTo(0, 0))

	// 2. Card → product page.
	let vt = await transitionOf(page, () => page.locator('a:has([data-vt-product-media])').first().click())
	await page.waitForURL(/\/products\/[^/?]+/)
	check(!vt.error, `[${mode}] card → PDP ran a view transition${vt.error ? ` (${vt.error})` : ''}`)
	check(vt.morph === (mode === 'full'), `[${mode}] card → PDP morph ${mode === 'full' ? 'ran' : 'stayed off'}`)
	smooth(`[${mode}] card → PDP animation`, vt.frames)

	// 3. Back to the page of cards.
	vt = await transitionOf(page, () => page.goBack())
	await page.waitForURL((url) => url.pathname === START)
	await page.waitForLoadState('networkidle')
	check(!vt.error, `[${mode}] Back ran a view transition${vt.error ? ` (${vt.error})` : ''}`)
	check(vt.morph === (mode === 'full'), `[${mode}] Back morph ${mode === 'full' ? 'ran' : 'stayed off'}`)
	smooth(`[${mode}] Back animation`, vt.frames)

	// 4. Cart drawer open, then closed with Escape.
	let sampling = page.evaluate(() => window.__sampleFrames(900))
	await page.locator('[data-testid="cart-icon"]').click()
	const drawer = page.locator('[role="dialog"][aria-modal="true"]')
	await drawer.waitFor()
	await page.waitForTimeout(300)
	const focus = await page.evaluate(() => {
		const d = document.querySelector('[role="dialog"][aria-modal="true"]')
		const a = document.activeElement
		return d?.contains(a) ? 'inside the drawer' : `${a?.tagName} ${a?.getAttribute('aria-label') ?? ''}`.trim()
	})
	await page.keyboard.press('Escape')
	const closed = await drawer
		.waitFor({ state: 'detached', timeout: 2000 })
		.then(() => true)
		.catch(() => false)
	check(closed, `[${mode}] Escape closes the cart drawer (focus was ${focus})`)
	smooth(`[${mode}] cart drawer open/close`, await sampling)
	if (!closed) await page.locator('[role="dialog"][aria-modal="true"] button[aria-label="Close cart"]').click()

	// 5. Mega-menu open, only when the store has a category with children. The panel fades in at
	//    both settings (a fade is feedback, not movement); a child link nudges only at full motion.
	await page.evaluate(() => window.scrollTo(0, 0))
	const megaLink = page.locator('.ed-mm-link[aria-haspopup="true"]').first()
	if (await megaLink.count()) {
		sampling = page.evaluate(() => window.__sampleFrames(500))
		await megaLink.hover()
		const opening = await page.evaluate(() => {
			const panel = document.querySelector('.ed-mm-panel')
			return panel ? Number(getComputedStyle(panel).opacity) : -1
		})
		check(opening >= 0 && opening < 1, `[${mode}] mega-menu panel fades in (opacity ${opening} just after hover)`)
		smooth(`[${mode}] mega-menu open`, await sampling)
		const child = page.locator('.ed-mm-panel a[href]').nth(1)
		if (await child.count()) {
			await child.hover()
			await page.waitForTimeout(250)
			const nudge = await child.evaluate((el) => getComputedStyle(el).transform)
			check(mode === 'full' ? !still(nudge) : still(nudge), `[${mode}] mega-menu child link hover transform ${nudge}`)
		}
		await page.mouse.move(5, 600)
		await page.waitForTimeout(400)

		// A pointer resting on a trigger opens the panel once and keeps it open. The backdrop used to
		// paint over the triggers, so a still pointer opened and closed the menu in a loop.
		await page.evaluate(() => {
			window.__mega = { opens: 0, closes: 0 }
			new MutationObserver((list) => {
				for (const m of list) {
					for (const n of m.addedNodes) if (n.nodeType === 1 && n.matches?.('.ed-mm-panel')) window.__mega.opens++
					for (const n of m.removedNodes) if (n.nodeType === 1 && n.matches?.('.ed-mm-panel')) window.__mega.closes++
				}
			}).observe(document.body, { childList: true, subtree: true })
		})
		const triggerBox = await megaLink.boundingBox()
		for (let i = 0; i < 12; i++) {
			await page.mouse.move(triggerBox.x + triggerBox.width / 2 + (i % 2), triggerBox.y + triggerBox.height / 2)
			await page.waitForTimeout(100)
		}
		const resting = await page.evaluate(() => window.__mega)
		check(resting.opens === 1 && resting.closes === 0, `[${mode}] mega-menu holds open under a resting pointer (opened ${resting.opens}, closed ${resting.closes})`)
		await page.mouse.move(5, 600)
		await page.waitForTimeout(500)
		const left = await page.evaluate(() => window.__mega.closes)
		check(left === 1, `[${mode}] mega-menu closes once the pointer leaves (closed ${left})`)
	} else {
		report.push(`SKIP  [${mode}] mega-menu: no category with children in this store`)
	}

	// 6. Overlays (tailwindcss-animate): zoom and slide at full motion, a pure fade under reduced.
	await page.locator('[aria-label="Open search"]').first().click()
	const dialog = page.locator('[role="dialog"]').first()
	await dialog.waitFor()
	const enterScale = await dialog.evaluate((el) => getComputedStyle(el).getPropertyValue('--tw-enter-scale').trim())
	check(mode === 'full' ? enterScale !== '1' : enterScale === '1', `[${mode}] search dialog --tw-enter-scale ${enterScale}`)
	await page.keyboard.press('Escape')
	await dialog.waitFor({ state: 'detached', timeout: 2000 }).catch(() => {})

	// 7. A primary button lifts on hover and gives on press at full motion; neither under reduced.
	const button = page.locator('.ed-sub-btn').first()
	if (await button.count()) {
		await button.scrollIntoViewIfNeeded()
		await button.hover()
		await page.waitForTimeout(250)
		const lift = await button.evaluate((el) => getComputedStyle(el).transform)
		await page.mouse.down()
		await page.waitForTimeout(250)
		const press = await button.evaluate((el) => getComputedStyle(el).transform)
		// Release away from the button, so this is not a click that submits the form.
		await page.mouse.move(5, 5)
		await page.mouse.up()
		check(mode === 'full' ? !still(lift) && !still(press) : still(lift) && still(press), `[${mode}] primary button lift ${lift}, press ${press}`)
	}

	// 8. A homepage category tile zooms its image at full motion only.
	const tile = page.locator('.ed-cat').first()
	if (await tile.count()) {
		await tile.scrollIntoViewIfNeeded()
		await tile.hover()
		await page.waitForTimeout(400)
		const zoom = await tile
			.locator('.ed-cat__media img, .ed-cat__placeholder')
			.first()
			.evaluate((el) => getComputedStyle(el).transform)
		check(mode === 'full' ? !still(zoom) : still(zoom), `[${mode}] category tile hover transform ${zoom}`)
	}

	// 9. Header menu links give on press, and the press is a transition, not a snap.
	const navLink = page.locator('.ed-nav-link').first()
	if (await navLink.count()) {
		const property = await navLink.evaluate((el) => getComputedStyle(el).transitionProperty)
		check(property.includes('transform'), `[${mode}] header link transitions transform (${property})`)
	}

	check(errors.length === 0, `[${mode}] no console errors${errors.length ? `: ${errors.join(' | ')}` : ''}`)
	await browser.close()

	// 10. vaul drawers (phone width): on the motion tokens, and a fade rather than a slide under reduced.
	const phone = await chromium.launch({ channel: 'chrome' })
	const mobile = await (await phone.newContext({ reducedMotion, viewport: { width: 390, height: 844 } })).newPage()
	// The listing's sort drawer is always there on a phone, whatever the catalogue holds.
	await mobile.goto(BASE + '/products', { waitUntil: 'networkidle' })
	const trigger = mobile.getByRole('button', { name: /sort/i }).first()
	if (await trigger.isVisible().catch(() => false)) {
		await trigger.click()
		const vaul = mobile.locator('[data-vaul-drawer]').first()
		await vaul.waitFor()
		await mobile.waitForTimeout(400)
		const open = await vaul.evaluate((el) => {
			const s = getComputedStyle(el)
			return { duration: s.transitionDuration.split(',')[0].trim(), property: s.transitionProperty, transform: s.transform }
		})
		check(open.duration === '0.22s', `[${mode}] vaul drawer duration ${open.duration}`)
		// At full motion the drawer is placed by a translate (a matrix once open); under reduced motion
		// the transform is removed outright and only opacity transitions.
		check(
			mode === 'full'
				? open.transform !== 'none' && open.property.includes('transform')
				: open.transform === 'none' && open.property.includes('opacity'),
			`[${mode}] vaul drawer transform ${open.transform}, transitions ${open.property}`
		)
	} else {
		report.push(`SKIP  [${mode}] vaul drawer: no sort trigger on /products at phone width`)
	}
	await phone.close()
}

// 11. Reported, not gated: the card → product page transition on a 4× slowed CPU.
{
	const browser = await chromium.launch({ channel: 'chrome' })
	const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
	const page = await context.newPage()
	await page.addInitScript(instrument)
	await page.goto(BASE + START, { waitUntil: 'networkidle' })
	const cdp = await context.newCDPSession(page)
	await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
	const vt = await transitionOf(page, () => page.locator('a:has([data-vt-product-media])').first().click())
	const usable = vt.frames.slice(1)
	const worst = Math.round(Math.max(0, ...usable))
	const fps = Math.round(1000 / (usable.reduce((a, b) => a + b, 0) / Math.max(1, usable.length)))
	report.push(`INFO  [full, 4× CPU] card → PDP animation: worst frame ${worst}ms, ${fps}fps (reported, not gated)`)
	await browser.close()
}

console.log(report.join('\n'))
process.exit(failures.length ? 1 : 0)
