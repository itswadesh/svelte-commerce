// Measures the storefront against the UI/UX Pro Max rule set (the skill's references/quick-reference.md)
// wherever a rule can be checked mechanically, on the production build, at phone and desktop width.
// Rules that need judgement (style match, copy, hierarchy) are left to a person.
//
//   PORT=3100 PUBLIC_LITEKART_API_URL=https://api.litekart.in PUBLIC_LITEKART_DOMAIN=demo.litekart.in node build
//   node scripts/audit-pro-max.mjs [--json out.json]      # BASE_URL defaults to http://127.0.0.1:3100
import { chromium } from '@playwright/test'
import fs from 'node:fs'

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3100'
const WIDTHS = [
	{ label: 'phone', width: 390, height: 844 },
	{ label: 'desktop', width: 1280, height: 900 }
]

// Routes worth a shopper's journey. The product page is found from the homepage at run time.
const ROUTES = ['/', '/products', '@product', '/rings', '/checkout/cart', '/checkout/address', '/contact-us', '/this-page-does-not-exist']

/** Runs inside the page: every mechanical check, returned as findings. */
function auditPage(isPhone) {
	const findings = []
	const add = (rule, severity, detail, sample) => findings.push({ rule, severity, detail, sample: sample?.slice(0, 140) })
	const visible = (el) => {
		const r = el.getBoundingClientRect()
		const s = getComputedStyle(el)
		return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > 0.05
	}
	const describe = (el) => {
		const id = el.id ? `#${el.id}` : ''
		const cls = (el.getAttribute('class') || '').split(/\s+/).filter(Boolean).slice(0, 2).join('.')
		const text = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('alt') || '').trim().replace(/\s+/g, ' ').slice(0, 40)
		return `<${el.tagName.toLowerCase()}${id}${cls ? '.' + cls : ''}> ${text}`
	}
	const accessibleName = (el) => {
		const label = el.getAttribute('aria-label')?.trim()
		if (label) return label
		const by = el.getAttribute('aria-labelledby')
		if (by)
			return by
				.split(/\s+/)
				.map((id) => document.getElementById(id)?.innerText || '')
				.join(' ')
				.trim()
		const text = (el.innerText || '').trim()
		if (text) return text
		const labelled = [...(el.labels || [])].map((l) => l.innerText.trim()).join(' ')
		if (labelled) return labelled
		const img = el.querySelector('img[alt]:not([alt=""]), svg[aria-label], [role="img"][aria-label]')
		if (img) return img.getAttribute('alt') || img.getAttribute('aria-label')
		return el.getAttribute('title')?.trim() || ''
	}

	// --- colour parsing and contrast (WCAG 2) ---
	const parse = (c) => {
		const m = c.match(/rgba?\(([^)]+)\)/)
		if (!m) return null
		const [r, g, b, a = 1] = m[1]
			.split(/[ ,/]+/)
			.filter(Boolean)
			.map(Number)
		return { r, g, b, a }
	}
	const lum = ({ r, g, b }) => {
		const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
		return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
	}
	const blend = (top, under) => ({
		r: top.r * top.a + under.r * (1 - top.a),
		g: top.g * top.a + under.g * (1 - top.a),
		b: top.b * top.a + under.b * (1 - top.a),
		a: 1
	})
	/** The colour behind an element, or null when an image or gradient makes it unknowable. */
	const backgroundOf = (el) => {
		const layers = []
		for (let n = el; n; n = n.parentElement) {
			const s = getComputedStyle(n)
			if (s.backgroundImage && s.backgroundImage !== 'none') return null
			const c = parse(s.backgroundColor)
			if (c && c.a > 0) {
				layers.push(c)
				if (c.a >= 1) break
			}
		}
		let base = { r: 255, g: 255, b: 255, a: 1 }
		for (const layer of layers.reverse()) base = blend(layer, base)
		return base
	}

	// 1. color-contrast: every element that directly holds visible text.
	const seen = new Set()
	let contrastFails = 0
	const contrastSamples = []
	for (const el of document.querySelectorAll('body *')) {
		if (!['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName) && visible(el)) {
			const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)
			if (!own) continue
			const s = getComputedStyle(el)
			const fg = parse(s.color)
			const bg = backgroundOf(el)
			if (!fg || !bg) continue
			const color = fg.a < 1 ? blend(fg, bg) : fg
			const [l1, l2] = [lum(color), lum(bg)].sort((a, b) => b - a)
			const ratio = (l1 + 0.05) / (l2 + 0.05)
			const size = parseFloat(s.fontSize)
			const bold = Number(s.fontWeight) >= 700
			const large = size >= 24 || (bold && size >= 18.66)
			const need = large ? 3 : 4.5
			if (ratio < need) {
				const key = `${s.color}|${bg.r},${bg.g},${bg.b}|${Math.round(size)}`
				contrastFails++
				if (!seen.has(key)) {
					seen.add(key)
					contrastSamples.push(
						`${ratio.toFixed(2)}:1 (needs ${need}) ${s.color} on rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)}) ${Math.round(size)}px — ${describe(el)}`
					)
				}
			}
		}
	}
	if (contrastFails) add('color-contrast', 'critical', `${contrastFails} text elements below WCAG AA`, contrastSamples.slice(0, 6).join(' || '))

	// 2. alt-text: images with no alt attribute at all (alt="" is a deliberate decorative image).
	const noAlt = [...document.querySelectorAll('img:not([alt])')].filter(visible)
	if (noAlt.length)
		add(
			'alt-text',
			'critical',
			`${noAlt.length} images without an alt attribute`,
			noAlt
				.slice(0, 3)
				.map((i) => i.currentSrc.split('/').pop())
				.join(', ')
		)

	// 3. aria-labels / icon-context: interactive elements with no accessible name.
	const nameless = [...document.querySelectorAll('a[href], button, [role="button"], [role="link"], [role="tab"], [role="menuitem"]')].filter(
		(el) => visible(el) && !accessibleName(el)
	)
	if (nameless.length)
		add('aria-labels', 'critical', `${nameless.length} controls with no accessible name`, nameless.slice(0, 4).map(describe).join(' | '))

	// 4. form-labels / input-labels: visible fields with no label.
	const fields = [...document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea')].filter(
		visible
	)
	const unlabelled = fields.filter((f) => {
		if (f.getAttribute('aria-label') || f.getAttribute('aria-labelledby')) return false
		if (f.id && document.querySelector(`label[for="${CSS.escape(f.id)}"]`)) return false
		return !f.closest('label')
	})
	if (unlabelled.length) add('form-labels', 'high', `${unlabelled.length} fields without a label`, unlabelled.slice(0, 4).map(describe).join(' | '))
	const placeholderOnly = fields.filter((f) => f.placeholder && !f.id && !f.closest('label') && !f.getAttribute('aria-labelledby'))
	if (placeholderOnly.length)
		add(
			'input-labels',
			'medium',
			`${placeholderOnly.length} fields whose only visible label is the placeholder`,
			placeholderOnly.slice(0, 3).map(describe).join(' | ')
		)

	// 5. heading-hierarchy.
	const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible)
	const h1s = headings.filter((h) => h.tagName === 'H1')
	if (h1s.length !== 1) add('heading-hierarchy', 'high', `${h1s.length} visible h1 elements (want exactly 1)`, h1s.map(describe).join(' | '))
	let prev = 0
	const skips = []
	for (const h of headings) {
		const level = Number(h.tagName[1])
		if (prev && level > prev + 1) skips.push(`h${prev}→h${level} ${describe(h)}`)
		prev = level
	}
	if (skips.length) add('heading-hierarchy', 'medium', `${skips.length} heading level skips`, skips.slice(0, 3).join(' | '))

	// 6. web-target-size (24px, WCAG 2.2 AA) and, on a phone, touch-target-size (44px) for controls
	//    that are not inline links inside running text.
	const controls = [
		...document.querySelectorAll('a[href], button, [role="button"], input[type="checkbox"], input[type="radio"], select, summary')
	].filter(visible)
	const tiny = []
	const small = []
	const big = (el, limit) => {
		const r = el.getBoundingClientRect()
		return r.width >= limit && r.height >= limit
	}
	// WCAG 2.2's "equivalent" exception: the same action is available through a target that is big
	// enough. A checkbox whose label also toggles it; a card's title link beside the card's image link.
	const hasEquivalent = (el, limit) => {
		const label = el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)
		if (label && label.getBoundingClientRect().height >= Math.min(limit, 24)) return true
		const href = el.tagName === 'A' && el.getAttribute('href')
		const scope = el.closest('article, li, section')
		if (!href || !scope) return false
		return [...scope.querySelectorAll('a[href]')].some((a) => a !== el && a.getAttribute('href') === href && big(a, limit))
	}
	// The phone's 44px rule is for controls a shopper acts with. Secondary navigation (breadcrumbs,
	// carousel dot indicators) keeps the 24px WCAG floor: 44px dots overflow a phone row at nine
	// slides, and a 44px breadcrumb row costs the product page its fold. docs/UX_SYSTEM.md, density.
	const secondary = (el) =>
		!!el.closest('nav[aria-label*="readcrumb" i], [data-target="secondary"]') || /^Go to slide/i.test(el.getAttribute('aria-label') || '')
	for (const el of controls) {
		const r = el.getBoundingClientRect()
		// Visually hidden until focused (a skip link): not a pointer target.
		if (r.width <= 1 || r.height <= 1) continue
		const inline =
			el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.parentElement && /P|LI|SPAN|TD/.test(el.parentElement.tagName)
		if (inline) continue
		if ((r.width < 24 || r.height < 24) && !hasEquivalent(el, 24)) tiny.push(`${Math.round(r.width)}×${Math.round(r.height)} ${describe(el)}`)
		else if (isPhone && (r.width < 44 || r.height < 44) && !secondary(el) && !hasEquivalent(el, 44))
			small.push(`${Math.round(r.width)}×${Math.round(r.height)} ${describe(el)}`)
	}
	if (tiny.length) add('web-target-size', 'critical', `${tiny.length} targets under 24×24px`, tiny.slice(0, 5).join(' | '))
	if (small.length) add('touch-target-size', 'high', `${small.length} phone targets under 44×44px`, small.slice(0, 5).join(' | '))

	// 7. horizontal-scroll.
	const overflow = document.documentElement.scrollWidth - innerWidth
	if (overflow > 1) {
		const wide = [...document.querySelectorAll('body *')]
			.filter((el) => el.getBoundingClientRect().right > innerWidth + 1 && visible(el) && getComputedStyle(el).position !== 'fixed')
			.slice(0, 3)
		add('horizontal-scroll', 'critical', `page scrolls ${overflow}px sideways`, wide.map(describe).join(' | '))
	}

	// 8. readable-font-size: text under 12px; on a phone, inputs under 16px zoom iOS on focus.
	const tinyText = new Map()
	for (const el of document.querySelectorAll('body *')) {
		if (!visible(el) || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue
		const size = parseFloat(getComputedStyle(el).fontSize)
		if (size < 12) tinyText.set(describe(el), size)
	}
	if (tinyText.size)
		add(
			'readable-font-size',
			'medium',
			`${tinyText.size} text elements under 12px`,
			[...tinyText]
				.slice(0, 4)
				.map(([d, s]) => `${s}px ${d}`)
				.join(' | ')
		)
	if (isPhone) {
		const zooming = fields.filter((f) => parseFloat(getComputedStyle(f).fontSize) < 16)
		if (zooming.length)
			add(
				'readable-font-size',
				'high',
				`${zooming.length} fields under 16px (iOS zooms the page on focus)`,
				zooming
					.slice(0, 3)
					.map((f) => `${getComputedStyle(f).fontSize} ${describe(f)}`)
					.join(' | ')
			)
		const short = fields.filter((f) => f.getBoundingClientRect().height < 44 && !['checkbox', 'radio'].includes(f.type))
		if (short.length)
			add(
				'touch-friendly-input',
				'medium',
				`${short.length} fields under 44px tall on a phone`,
				short
					.slice(0, 3)
					.map((f) => `${Math.round(f.getBoundingClientRect().height)}px ${describe(f)}`)
					.join(' | ')
			)
	}

	// 9. image-dimension and lazy-load-below-fold.
	const imgs = [...document.querySelectorAll('img')].filter(visible)
	// A box within five levels that sets its own aspect-ratio reserves the space just as well.
	const boxed = (i) => {
		for (let n = i, depth = 0; n && depth < 6; n = n.parentElement, depth++) {
			if (getComputedStyle(n).aspectRatio !== 'auto') return true
		}
		return false
	}
	const unsized = imgs.filter((i) => !i.getAttribute('width') && !i.getAttribute('height') && !boxed(i))
	if (unsized.length)
		add(
			'image-dimension',
			'medium',
			`${unsized.length} images with no width/height or aspect-ratio`,
			unsized
				.slice(0, 3)
				.map((i) => i.currentSrc.split('/').pop())
				.join(', ')
		)
	const eagerBelow = imgs.filter((i) => i.getBoundingClientRect().top > innerHeight * 1.5 && i.loading !== 'lazy')
	if (eagerBelow.length)
		add(
			'lazy-load-below-fold',
			'medium',
			`${eagerBelow.length} below-the-fold images not lazy-loaded`,
			eagerBelow
				.slice(0, 3)
				.map((i) => i.currentSrc.split('/').pop())
				.join(', ')
		)

	// 10. no-emoji-icons.
	const emoji = [...document.querySelectorAll('button, a, [role="button"]')].filter(
		(el) => visible(el) && /\p{Extended_Pictographic}/u.test(el.innerText || '')
	)
	if (emoji.length) add('no-emoji-icons', 'medium', `${emoji.length} controls using emoji as icons`, emoji.slice(0, 3).map(describe).join(' | '))

	// 11. number-tabular: prices should not jiggle as they change.
	const prices = [...document.querySelectorAll('[data-testid*="price" i], [class*="price" i]')].filter(
		(el) => visible(el) && /\d/.test(el.innerText || '')
	)
	const proportional = prices.filter((p) => !getComputedStyle(p).fontVariantNumeric.includes('tabular'))
	if (prices.length && proportional.length === prices.length)
		add('number-tabular', 'low', `prices use proportional figures (${prices.length} price elements)`, describe(prices[0]))

	// 12. skip-links and viewport-meta.
	if (!document.querySelector('a[href="#main"], a[href="#content"], .skip-link')) add('skip-links', 'high', 'no skip link')
	const vp = document.querySelector('meta[name="viewport"]')?.content || ''
	if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/.test(vp)) add('viewport-meta', 'critical', `zoom disabled: ${vp}`)

	return findings
}

const results = []
const browser = await chromium.launch({ channel: 'chrome' })
let productPath = null

for (const { label, width, height } of WIDTHS) {
	// The phone pass is a touch device: without it Chrome reports a fine pointer at any width, and
	// every `(pointer: fine)` desktop size applies to the "phone".
	const phone = label === 'phone'
	const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', hasTouch: phone, isMobile: phone })
	for (const route of ROUTES) {
		const page = await context.newPage()
		const errors = []
		page.on('pageerror', (e) => errors.push(e.message.slice(0, 160)))
		page.on('console', (m) => {
			if (m.type() !== 'error') return
			try {
				if (new URL(m.location().url).host !== new URL(BASE).host) return
			} catch {}
			errors.push(m.text().slice(0, 160))
		})
		// Layout shift over the load, from the first paint.
		await page.addInitScript(() => {
			window.__cls = 0
			new PerformanceObserver((list) => {
				for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value
			}).observe({ type: 'layout-shift', buffered: true })
		})
		let path = route
		if (route === '@product') {
			// The homepage's cards load from the API after hydration, and the demo API is sometimes slow
			// to answer from here: try a few times, then fall back to a product this store is known to carry.
			for (let attempt = 0; !productPath && attempt < 3; attempt++) {
				await page.goto(BASE + '/', { waitUntil: 'networkidle' })
				const card = page.locator('a:has([data-vt-product-media])').first()
				const href = await card.getAttribute('href', { timeout: 15_000 }).catch(() => null)
				if (href) productPath = new URL(href, BASE).pathname
			}
			productPath ??= process.env.PRODUCT_PATH ?? '/products/160-ct-lab-grown-diamond-f-vs-solitaire-ring-10k-white-gold'
			path = productPath
		}
		const response = await page.goto(BASE + path, { waitUntil: 'networkidle' }).catch(() => null)
		await page.waitForTimeout(1200)
		const findings = await page.evaluate(auditPage, label === 'phone')
		const cls = await page.evaluate(() => window.__cls)
		if (cls > 0.1) findings.push({ rule: 'content-jumping', severity: 'high', detail: `cumulative layout shift ${cls.toFixed(3)} (want < 0.1)` })
		else if (cls > 0.05) findings.push({ rule: 'content-jumping', severity: 'low', detail: `cumulative layout shift ${cls.toFixed(3)}` })

		// focus-states: the first 12 tab stops must each show a visible indicator.
		const invisible = []
		await page.evaluate(() => document.activeElement?.blur())
		for (let i = 0; i < 12; i++) {
			await page.keyboard.press('Tab')
			const r = await page.evaluate(() => {
				const el = document.activeElement
				if (!el || el === document.body) return null
				const s = getComputedStyle(el)
				const ring = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== 'none')
				const r = el.getBoundingClientRect()
				return {
					ring,
					onScreen: r.bottom > 0 && r.top < innerHeight,
					desc: `<${el.tagName.toLowerCase()}> ${(el.getAttribute('aria-label') || el.innerText || '').trim().slice(0, 30)}`
				}
			})
			if (r && !r.ring) invisible.push(r.desc)
			if (r && !r.onScreen)
				findings.push({ rule: 'focus-not-obscured', severity: 'high', detail: 'a focused control is off screen or under sticky UI', sample: r.desc })
		}
		if (invisible.length)
			findings.push({
				rule: 'focus-states',
				severity: 'critical',
				detail: `${invisible.length} of the first 12 tab stops show no focus indicator`,
				sample: invisible.slice(0, 4).join(' | ')
			})
		// A route that is meant to 404 logs its own document's 404; that is not an error.
		if (response?.status() === 404) errors.splice(0, errors.length, ...errors.filter((e) => !/status of 404/.test(e)))
		if (errors.length)
			findings.push({ rule: 'console-errors', severity: 'high', detail: `${errors.length} console errors`, sample: errors.slice(0, 2).join(' | ') })

		results.push({ width: label, route: route === '@product' ? 'product page' : route, status: response?.status() ?? 'no response', findings })
		await page.close()
	}
	await context.close()
}
await browser.close()

const ORDER = { critical: 0, high: 1, medium: 2, low: 3 }
for (const r of results) {
	console.log(`\n## ${r.route} @ ${r.width} (HTTP ${r.status})`)
	for (const f of r.findings.sort((a, b) => ORDER[a.severity] - ORDER[b.severity]))
		console.log(`- [${f.severity}] ${f.rule}: ${f.detail}${f.sample ? `\n    e.g. ${f.sample}` : ''}`)
	if (!r.findings.length) console.log('- no mechanical findings')
}
const jsonAt = process.argv.indexOf('--json')
if (jsonAt > -1) fs.writeFileSync(process.argv[jsonAt + 1], JSON.stringify(results, null, 2))
