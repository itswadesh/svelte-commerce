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

	// 5. Mega-menu open, only when the store has a category with children.
	const megaLink = page.locator('.ed-mm-link[aria-haspopup="true"]').first()
	if (await megaLink.count()) {
		sampling = page.evaluate(() => window.__sampleFrames(500))
		await megaLink.hover()
		smooth(`[${mode}] mega-menu open`, await sampling)
	} else {
		report.push(`SKIP  [${mode}] mega-menu: no category with children in this store`)
	}

	check(errors.length === 0, `[${mode}] no console errors${errors.length ? `: ${errors.join(' | ')}` : ''}`)
	await browser.close()
}

console.log(report.join('\n'))
process.exit(failures.length ? 1 : 0)
