#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import * as cheerio from 'cheerio'
import { parse, generate, walk as cssWalk } from 'css-tree'

const args = parseArgs(process.argv.slice(2))
const cmd = args._[0]

if (cmd === 'extract') {
	await extractCommand(args)
} else if (cmd === 'verify') {
	await verifyCommand(args)
} else {
	console.log(`Usage:
  design-contract extract --source <static-design-dir> --out <design-contract.json>
  design-contract verify  --contract <design-contract.json> --url <running-app-url> [--out <report.json>]
`)
	process.exit(1)
}

async function extractCommand(opts) {
	if (!opts.source || !opts.out) fail('extract requires --source and --out')

	const sourceDir = path.resolve(opts.source)
	const files = walkFiles(sourceDir)
	const htmlFile = files.find((file) => /index\.html?$/i.test(file)) || files.find((file) => /\.html?$/i.test(file))
	if (!htmlFile) fail(`No HTML file found in ${sourceDir}`)

	const cssFiles = files.filter((file) => /\.css$/i.test(file))
	const css = cssFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n')
	const cssIndex = buildCssIndex(css)
	const html = fs.readFileSync(htmlFile, 'utf8')
	const $ = cheerio.load(html)

	const staticSections = $('body')
		.find('body > header, body > nav, body > section, body > footer, body > div[id]')
		.toArray()
		.filter((el) => isMajorElement($, el))
		.map((el, index) => extractSection($, el, index, cssIndex, sourceDir))
	const rendered = await extractRenderedSignals(htmlFile, staticSections.length)
	const sections = mergeRenderedSections(staticSections, rendered.sections)

	const contract = {
		version: 1,
		generatedAt: new Date().toISOString(),
		extraction: {
			static: true,
			rendered: rendered.enabled,
			renderedReason: rendered.reason
		},
		source: {
			dir: path.relative(process.cwd(), sourceDir) || '.',
			html: path.relative(process.cwd(), htmlFile),
			css: cssFiles.map((file) => path.relative(process.cwd(), file))
		},
		viewportChecks: [
			{ name: 'desktop', width: 1366, height: 900 },
			{ name: 'mobile', width: 390, height: 844 }
		],
		semanticColors: rendered.semanticColors || {},
		sections
	}

	fs.mkdirSync(path.dirname(path.resolve(opts.out)), { recursive: true })
	fs.writeFileSync(opts.out, JSON.stringify(contract, null, 2))
	console.log(`design contract written: ${opts.out}`)
}

async function extractRenderedSignals(htmlFile, expectedSections) {
	let chromium
	try {
		;({ chromium } = await import('playwright'))
	} catch {
		return {
			enabled: false,
			reason: 'Playwright is not installed; static extraction only.',
			sections: [],
			semanticColors: {}
		}
	}

	let browser
	try {
		browser = await launchBrowser(chromium)
		const page = await browser.newPage({ viewport: { width: 1366, height: 900 } })
		await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load', timeout: 45000 })
		await page.waitForTimeout(500)
		const result = await page.evaluate(({ expectedSections, renderer }) => {
			const render = new Function(`return (${renderer})`)()
			return render({ expectedSections })
		}, {
			expectedSections,
			renderer: renderSignalsInPage.toString()
		})
		await page.close()
		return {
			enabled: true,
			reason: 'Computed styles extracted with Playwright.',
			...result
		}
	} catch (error) {
		return {
			enabled: false,
			reason: `Playwright extraction failed: ${error.message}`,
			sections: [],
			semanticColors: {}
		}
	} finally {
		if (browser) await browser.close()
	}
}

function mergeRenderedSections(staticSections, renderedSections = []) {
	return staticSections.map((section, index) => {
		const rendered = renderedSections[index]
		if (!rendered) return section
		return {
			...section,
			name: section.name || rendered.name,
			selector: rendered.selector || section.selector,
			selectorHint: rendered.selectorHint,
			bounds: rendered.bounds,
			styles: { ...section.styles, ...rendered.styles },
			headings: mergeRenderedItems(section.headings, rendered.headings),
			labels: mergeRenderedItems(section.labels, rendered.labels),
			buttons: mergeRenderedItems(section.buttons, rendered.buttons),
			cards: mergeRenderedItems(section.cards, rendered.cards)
		}
	})
}

function mergeRenderedItems(staticItems = [], renderedItems = []) {
	return staticItems.map((item, index) => {
		const rendered = renderedItems[index]
		if (!rendered) return item
		return {
			...item,
			bounds: rendered.bounds,
			styles: { ...item.styles, ...rendered.styles }
		}
	})
}

function renderSignalsInPage({ expectedSections }) {
	const sections = [...document.querySelectorAll('body > header, body > nav, body > section, body > footer, body > div[id]')]
		.filter(isMajorElement)
		.slice(0, expectedSections || undefined)
		.map((el, index) => sectionSignal(el, index))
	return {
		sections,
		semanticColors: collectSemanticColors()
	}

	function sectionSignal(el, index) {
		const headingText = textOf(el.querySelector('h1,h2,h3,h4,h5,h6'))
		return {
			name: inferRenderedName(el, index, headingText),
			selector: stableSelector(el, index),
			selectorHint: headingText ? `${el.tagName.toLowerCase()} containing heading "${headingText}"` : '',
			bounds: rect(el),
			styles: importantComputedStyles(el),
			headings: [...el.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((node) => ({
				text: textOf(node),
				bounds: rect(node),
				styles: importantComputedStyles(node)
			})).filter((item) => item.text),
			labels: [...el.querySelectorAll('.slbl,.script-label,.subtitle,.sub-title,.eyebrow,[class*="label"],[class*="badge"]')].slice(0, 10).map((node) => ({
				text: textOf(node),
				bounds: rect(node),
				styles: importantComputedStyles(node)
			})).filter((item) => item.text),
			buttons: [...el.querySelectorAll('a,button')].map((node) => ({
				text: textOf(node),
				bounds: rect(node),
				styles: importantComputedStyles(node)
			})).filter((item) => item.text),
			cards: [...el.querySelectorAll('.card,.product-item,.category-item,.post-item,[class*="card"]')].slice(0, 5).map((node) => ({
				bounds: rect(node),
				styles: importantComputedStyles(node)
			}))
		}
	}

	function collectSemanticColors() {
		const probes = {
			body: document.body,
			primaryButton: pickProbe('.btn-primary, button[class*="primary"], a[class*="primary"], [role="button"][class*="primary"]', {
				preferFilled: true
			}),
			secondaryButton: pickProbe('.btn-secondary, .btn-dark, button[class*="secondary"], a[class*="secondary"], [role="button"][class*="secondary"]', {
				preferFilled: true
			}),
			accentButton: pickProbe('.btn-warning, .badge, [class*="discount"], [class*="sale"]', {
				preferFilled: true
			}),
			hero: document.querySelector('section'),
			card: document.querySelector('.card, .product-item, [class*="card"]'),
			heading: document.querySelector('h1,h2,h3')
		}
		return Object.fromEntries(Object.entries(probes).filter(([, el]) => el).map(([name, el]) => {
			const styles = getComputedStyle(el)
			return [name, {
				color: styles.color,
				backgroundColor: styles.backgroundColor,
				borderColor: styles.borderColor,
				fontFamily: styles.fontFamily,
				confidenceSource: computedSelector(el)
			}]
		}))
	}

	function pickProbe(selector, options = {}) {
		const candidates = [...document.querySelectorAll(selector)].filter((el) => rect(el).width > 0 && rect(el).height > 0)
		if (!candidates.length) return null
		if (!options.preferFilled) return candidates[0]
		return candidates.find((el) => {
			const bg = getComputedStyle(el).backgroundColor
			return bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent'
		}) || candidates[0]
	}

	function importantComputedStyles(el) {
		const styles = getComputedStyle(el)
		const out = {}
		for (const prop of [
			'display',
			'grid-template-columns',
			'align-items',
			'justify-content',
			'gap',
			'background',
			'background-color',
			'background-image',
			'color',
			'font-family',
			'font-size',
			'font-weight',
			'line-height',
			'margin',
			'margin-bottom',
			'padding',
			'border',
			'border-top',
			'border-right',
			'border-bottom',
			'border-left',
			'border-color',
			'border-width',
			'border-style',
			'border-radius',
			'box-shadow',
			'width',
			'height',
			'object-fit'
		]) {
			const value = styles.getPropertyValue(prop)
			if (value && value !== 'none' && value !== 'normal' && value !== '0px' && value !== 'auto') out[prop] = value
		}
		return out
	}

	function stableSelector(el, index) {
		if (el.id) return `#${CSS.escape(el.id)}`
		const semanticClass = [...el.classList].find((cls) => !isUtilityClass(cls))
		if (semanticClass) return `.${CSS.escape(semanticClass)}`
		return `${el.tagName.toLowerCase()}:nth-of-type(${index + 1})`
	}

	function computedSelector(el) {
		if (el.id) return `#${el.id}`
		if (el.className && typeof el.className === 'string') return `${el.tagName.toLowerCase()}.${el.className.trim().split(/\s+/).slice(0, 3).join('.')}`
		return el.tagName.toLowerCase()
	}

	function inferRenderedName(el, index, headingText) {
		const id = el.id || ''
		if (id) return id
		const classText = [...el.classList].join(' ')
		if (/hero|banner|slider/i.test(classText) || index <= 3 && /organic|doorsteps|welcome|shop/i.test(headingText)) return 'hero'
		if (/category/i.test(classText) || /category/i.test(headingText)) return 'category'
		if (/product/i.test(classText) || /products/i.test(headingText)) return 'products'
		if (/newsletter|subscribe/i.test(classText) || /subscribe|discount/i.test(headingText)) return 'newsletter'
		if (el.tagName.toLowerCase() === 'footer') return 'footer'
		if (el.tagName.toLowerCase() === 'header') return 'header'
		return `${el.tagName.toLowerCase()}-${index + 1}`
	}

	function rect(el) {
		const r = el.getBoundingClientRect()
		return {
			x: Math.round(r.x),
			y: Math.round(r.y),
			width: Math.round(r.width),
			height: Math.round(r.height)
		}
	}

	function textOf(el) {
		return String(el?.textContent || '').replace(/\s+/g, ' ').trim()
	}

	function isMajorElement(el) {
		const id = el.id || ''
		if (/^(search|.*Ov$|.*Pop$|.*Ok$|navmenu|mgrid)$/i.test(id)) return false
		const text = textOf(el)
		if (['HEADER', 'NAV', 'FOOTER', 'SECTION'].includes(el.tagName)) return true
		return !!id && text.length > 20
	}

	function isUtilityClass(cls) {
		return /^(container|row|col|col-\d+|col-(xs|sm|md|lg|xl|xxl)-|d-|align-|justify-|gap-|g-|gx-|gy-|mb-|mt-|ms-|me-|mx-|my-|p-|px-|py-|pt-|pb-|ps-|pe-|text-|img-|w-|h-|position-|swiper|aos|fade|zoom|active$|show$|collapse$|navbar|nav-|btn$)/.test(cls)
	}
}

async function verifyCommand(opts) {
	if (!opts.contract || !opts.url) fail('verify requires --contract and --url')

	let chromium
	try {
		;({ chromium } = await import('playwright'))
	} catch {
		fail('Playwright is required for design verification. Install it with npm i -D playwright.')
	}

	const contractPath = path.resolve(opts.contract)
	const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'))
	const browser = await launchBrowser(chromium)
	const report = {
		contract: path.relative(process.cwd(), contractPath),
		url: opts.url,
		generatedAt: new Date().toISOString(),
		checks: [],
		summary: { passed: 0, failed: 0, warnings: 0 }
	}

	for (const viewport of contract.viewportChecks || [{ name: 'desktop', width: 1366, height: 900 }]) {
		const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } })
		await page.goto(opts.url, { waitUntil: 'load', timeout: 45000 })
		await page.waitForTimeout(250)
		const checks = await page.evaluate(({ sections, viewport, verifier }) => {
			const verify = new Function(`return (${verifier})`)()
			return verify({ sections, viewport })
		}, {
			sections: contract.sections,
			viewport,
			verifier: verifyInPage.toString()
		})
		report.checks.push({ viewport, checks })
		await page.close()
	}

	await browser.close()

	for (const group of report.checks) {
		for (const check of group.checks) {
			if (check.status === 'pass') report.summary.passed += 1
			else if (check.status === 'warn') report.summary.warnings += 1
			else report.summary.failed += 1
		}
	}

	const reportPath = opts.out || path.join(path.dirname(contractPath), 'design-verify-report.json')
	fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

	console.log(`design verify report written: ${reportPath}`)
	console.log(`passed ${report.summary.passed}, warnings ${report.summary.warnings}, failed ${report.summary.failed}`)

	if (report.summary.failed > 0) {
		const failures = report.checks.flatMap((group) =>
			group.checks
				.filter((check) => check.status === 'fail')
				.slice(0, 8)
				.map((check) => `[${group.viewport.name}] ${check.section}: ${check.message}`)
		)
		console.error(failures.join('\n'))
		process.exitCode = 1
	}
}

async function launchBrowser(chromium) {
	try {
		return await chromium.launch()
	} catch (error) {
		const chromePath = findSystemChrome()
		if (!chromePath) throw error
		return chromium.launch({ executablePath: chromePath })
	}
}

function findSystemChrome() {
	const candidates = [
		'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
		'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
		path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
	]
	return candidates.find((candidate) => candidate && fs.existsSync(candidate))
}

function extractSection($, el, index, cssIndex, sourceDir) {
	const node = $(el)
	const id = node.attr('id') || ''
	const classList = splitClasses(node.attr('class'))
	const selector = id ? `#${id}` : classList.length ? `.${classList[0]}` : el.tagName
	const name = id || inferName(classList, el.tagName, index)
	const matchedStyles = collectStyles(selector, classList, el.tagName, cssIndex)
	const headings = node
		.find('h1,h2,h3,h4,h5,h6')
		.toArray()
		.map((h) => ({
			tag: h.tagName,
			text: cleanText($(h).text()),
			classes: splitClasses($(h).attr('class')),
			styles: collectStyles(selectorFor($, h), splitClasses($(h).attr('class')), h.tagName, cssIndex)
		}))
		.filter((h) => h.text)
	const labels = node
		.find('.slbl,.script-label,.subtitle,.sub-title,.eyebrow,[class*="label"],[class*="badge"]')
		.toArray()
		.slice(0, 10)
		.map((label) => ({
			text: cleanText($(label).text()),
			classes: splitClasses($(label).attr('class')),
			styles: collectStyles(selectorFor($, label), splitClasses($(label).attr('class')), label.tagName, cssIndex)
		}))
		.filter((label) => label.text)
	const iconRoles = node
		.find('i[class],svg[class]')
		.toArray()
		.map((icon) => iconRole($(icon).attr('class') || ''))
		.filter(Boolean)
	const images = node
		.find('img')
		.toArray()
		.map((img) => ({
			src: normalizeAsset($(img).attr('src'), sourceDir),
			alt: $(img).attr('alt') || ''
		}))
	const buttons = node
		.find('a,button')
		.toArray()
		.map((button) => ({
			text: cleanText($(button).text()),
			href: $(button).attr('href') || '',
			classes: splitClasses($(button).attr('class')),
			styles: collectStyles(selectorFor($, button), splitClasses($(button).attr('class')), button.tagName, cssIndex)
		}))
		.filter((button) => button.text)
	const cardSelectors = detectCardSelectors($, node)
	const cards = cardSelectors.map((item) => ({
		selector: item.selector,
		count: item.count,
		styles: collectStyles(item.selector, selectorClasses(item.selector), 'div', cssIndex)
	}))

	return {
		name,
		selector,
		tag: el.tagName,
		classes: classList,
		text: cleanText(node.clone().children('script,style').remove().end().text()).slice(0, 500),
		styles: matchedStyles,
		headings,
		labels,
		images,
		buttons,
		icons: [...new Set(iconRoles)],
		cards
	}
}

function buildCssIndex(css) {
	const index = []
	let ast
	try {
		ast = parse(css, { parseValue: false })
	} catch {
		return index
	}
	cssWalk(ast, {
		visit: 'Rule',
		enter(rule) {
			const selector = generate(rule.prelude)
			const declarations = {}
			rule.block.children.forEach((decl) => {
				if (decl.type !== 'Declaration') return
				const prop = decl.property.toLowerCase()
				if (isTrackedProp(prop)) declarations[prop] = generate(decl.value).trim()
			})
			if (Object.keys(declarations).length) {
				for (const part of selector.split(',').map((s) => s.trim()).filter(Boolean)) {
					index.push({ selector: part, declarations })
				}
			}
		}
	})
	return index
}

function collectStyles(selector, classList, tag, cssIndex) {
	const picked = {}
	const candidates = new Set([selector, tag, ...classList.map((cls) => `.${cls}`)])
	if (selector?.startsWith('#')) candidates.add(selector)
	for (const rule of cssIndex) {
		if (!selectorMatches(rule.selector, candidates, classList, tag)) continue
		Object.assign(picked, rule.declarations)
	}
	return pickImportantStyles(picked)
}

function selectorMatches(ruleSelector, candidates, classList, tag) {
	const simple = ruleSelector.replace(/:(hover|focus|active|before|after).*/g, '').trim()
	if (candidates.has(simple)) return true
	if (tag && simple === tag) return true
	for (const cls of classList) {
		if (new RegExp(`(^|[\\s>+~.#])\\.${escapeRegex(cls)}($|[\\s>+~.#:[\\]])`).test(simple)) return true
	}
	return false
}

function pickImportantStyles(styles) {
	const keys = [
		'display',
		'grid-template-columns',
		'align-items',
		'justify-content',
		'gap',
		'background',
		'background-color',
		'background-image',
		'color',
		'font-family',
		'font-size',
		'font-weight',
		'line-height',
		'margin',
		'margin-bottom',
		'padding',
		'border',
		'border-top',
		'border-right',
		'border-bottom',
		'border-left',
		'border-color',
		'border-width',
		'border-style',
		'border-radius',
		'box-shadow',
		'width',
		'height',
		'object-fit'
	]
	return Object.fromEntries(keys.filter((key) => styles[key] != null).map((key) => [key, styles[key]]))
}

function verifyInPage({ sections, viewport }) {
	const checks = []
	const add = (status, section, message, details = {}) => checks.push({ status, section, message, details })
	for (const section of sections) {
		const el = findSection(section)
		if (!el) {
			add('fail', section.name, `missing section ${section.selector}`)
			continue
		}
		add('pass', section.name, 'section exists')
		for (const heading of section.headings.slice(0, 3)) {
			if (heading.text && !textIncludes(el.textContent, heading.text)) add('fail', section.name, `missing heading text "${heading.text}"`)
			else if (heading.text) add('pass', section.name, `heading text present: ${heading.text}`)
			checkStyle(add, section.name, el, heading.styles, ['font-family', 'font-size', 'font-weight', 'line-height'])
		}
		for (const label of section.labels.slice(0, 3)) {
			if (label.text && !textIncludes(el.textContent, label.text)) add('fail', section.name, `missing label text "${label.text}"`)
			else if (label.text) add('pass', section.name, `label text present: ${label.text}`)
		}
		if (section.images.length) {
			const actual = el.querySelectorAll('img').length
			if (actual < section.images.length) add('warn', section.name, `image count lower than source`, { expectedAtLeast: section.images.length, actual })
			else add('pass', section.name, `image count ok`, { actual })
		}
		for (const card of section.cards) {
			const actual = countCards(el, card.selector)
			if (card.count >= 2 && actual < card.count) add('fail', section.name, `card count lower than source for ${card.selector}`, { expectedAtLeast: card.count, actual })
			else if (card.count >= 2) add('pass', section.name, `card count ok for ${card.selector}`, { actual })
		}
		for (const role of section.icons) {
			if (!hasIconRole(el, role)) add('fail', section.name, `missing icon role "${role}"`)
			else add('pass', section.name, `icon role present: ${role}`)
		}
		checkStyle(add, section.name, el, section.styles, ['background', 'background-color', 'background-image', 'color'])
		checkStyle(add, section.name, el, section.styles, ['font-weight', 'border', 'border-color', 'border-width', 'border-style', 'border-radius', 'padding', 'margin', 'gap'])
	}
	return checks

	function findSection(section) {
		const selectors = [section.selector]
		if (section.selector.startsWith('#')) selectors.push(section.selector.replace(/^#/, '[id="') + '"]')
		for (const selector of selectors) {
			try {
				const found = document.querySelector(selector)
				if (found) return found
			} catch {}
		}
		const textNeedle = section.headings?.[0]?.text || section.labels?.[0]?.text
		if (!textNeedle) return null
		return [...document.querySelectorAll('section,header,footer,nav,main > div,[id]')].find((node) => textIncludes(node.textContent, textNeedle)) || null
	}

	function countCards(scope, selector) {
		const classNames = (selector.match(/\.[A-Za-z0-9_-]+/g) || []).map((s) => s.slice(1))
		for (const cls of classNames) {
			const aliases = cardClassAliases(cls)
			const count = aliases.reduce((sum, alias) => sum + scope.querySelectorAll(`.${CSS.escape(alias)}`).length, 0)
			if (count) return count
		}
		return 0
	}

	function hasIconRole(scope, role) {
		const normalized = normalizeIconRole(role)
		return [...scope.querySelectorAll('svg[class],i[class]')].some((icon) => normalizeIconRole(icon.getAttribute('class') || '').includes(normalized))
	}

	function normalizeIconRole(value) {
		return String(value)
			.toLowerCase()
			.replace(/^fa-/, '')
			.replace(/^lucide-/, '')
			.replace(/envelope/g, 'mail')
			.replace(/phone-alt/g, 'phone')
			.replace(/paper-plane/g, 'send')
			.replace(/check-circle/g, 'circle-check')
			.replace(/chevron-right/g, 'arrow-right')
			.replace(/expand-alt/g, 'expand')
			.replace(/th-large/g, 'grid')
			.replace(/shipping-fast/g, 'truck')
			.replace(/fire/g, 'flame')
			.replace(/shopping-cart/g, 'cart')
			.replace(/truck-fast|truck-fast-solid|truck/g, 'truck')
			.replace(/calendar-day/g, 'calendar')
			.replace(/map-marker-alt|location-dot/g, 'map-pin')
	}

	function cardClassAliases(cls) {
		const map = {
			blcard: ['blcard', 'blog-card'],
			catcard: ['catcard', 'ccard', 'category-card'],
			ccard: ['ccard', 'catcard', 'category-card'],
			cditem: ['cditem', 'countdown-item', 'deal-card'],
			chcard: ['chcard', 'chef-card'],
			ctitem: ['ctitem', 'contact-item'],
			fcard: ['fcard', 'floating-card'],
			gitem: ['gitem', 'gallery-item'],
			hrscard: ['hrscard', 'hours-card'],
			hrscta: ['hrscta', 'hours-cta'],
			hrsrow: ['hrsrow', 'hours-row'],
			mcard: ['mcard', 'menu-card'],
			tescard: ['tescard', 'testimonial-card', 'tcard'],
			tcard: ['tcard', 'testimonial-card', 'tescard']
		}
		return map[cls] || [cls]
	}

	function normalizeText(value) {
		return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '')
	}

	function textIncludes(actual, expected) {
		return normalizeText(actual).includes(normalizeText(expected))
	}

	function checkStyle(addCheck, sectionName, el, sourceStyles, props) {
		if (!sourceStyles || !Object.keys(sourceStyles).length) return
		const computed = getComputedStyle(el)
		for (const prop of props) {
			const expected = sourceStyles[prop]
			if (!expected) continue
			const actual = computed.getPropertyValue(prop)
			if (expected.includes('gradient') || expected.includes('var(') || expected.startsWith('#') || expected.startsWith('rgb')) {
				addCheck(actual && actual !== 'none' && actual !== 'rgba(0, 0, 0, 0)' ? 'pass' : 'warn', sectionName, `style signal checked: ${prop}`, { expected, actual })
			}
		}
	}
}

function detectCardSelectors($, node) {
	const counts = new Map()
	node.find('[class]').each((_, child) => {
		for (const cls of splitClasses($(child).attr('class'))) {
			if (isUtilityClass(cls)) continue
			if (/(card|item|slide|box|mcard|ccard|tcard|blog|chef|category|testimonial|portfolio|hrsrow|hrscard|hrscta|fcard|mitem)/i.test(cls)) {
				counts.set(cls, (counts.get(cls) || 0) + 1)
			}
		}
	})
	return [...counts.entries()]
		.filter(([, count]) => count >= 2)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([cls, count]) => ({ selector: `.${cls}`, count }))
}

function selectorFor($, el) {
	const node = $(el)
	const id = node.attr('id')
	if (id) return `#${id}`
	const classes = splitClasses(node.attr('class'))
	if (classes.length) return `.${classes[0]}`
	return el.tagName
}

function iconRole(className) {
	const classes = splitClasses(className)
	if (classes.some((cls) => /facebook|instagram|youtube|tiktok|twitter|linkedin|whatsapp|telegram/.test(cls))) return null
	const fa = classes.find((cls) => /^(fa-|fas|far|fab)/.test(cls) && !['fas', 'far', 'fab', 'fa-solid', 'fa-regular', 'fa-brands'].includes(cls))
	if (fa) return normalizeIconRole(fa.replace(/^fa-/, ''))
	const lucide = classes.find((cls) => cls.startsWith('lucide-') && cls !== 'lucide-icon')
	if (lucide) return normalizeIconRole(lucide.replace(/^lucide-/, ''))
	return null
}

function normalizeIconRole(value) {
	return String(value)
		.toLowerCase()
		.replace(/^fa-/, '')
		.replace(/^lucide-/, '')
		.replace(/fire/g, 'flame')
		.replace(/shopping-cart/g, 'cart')
		.replace(/truck-fast|truck-fast-solid|truck/g, 'truck')
		.replace(/calendar-day/g, 'calendar')
		.replace(/map-marker-alt|location-dot/g, 'map-pin')
}

function isUtilityClass(cls) {
	return /^(container|row|col|col-\d+|col-(xs|sm|md|lg|xl|xxl)-|d-|align-|justify-|gap-|g-|gx-|gy-|mb-|mt-|ms-|me-|mx-|my-|p-|px-|py-|pt-|pb-|ps-|pe-|text-|img-|w-|h-|position-|swiper|aos|fade|zoom|active$|show$|collapse$|navbar|nav-|btn$)/.test(cls)
}

function normalizeAsset(src, sourceDir) {
	if (!src) return ''
	if (/^(https?:)?\/\//.test(src)) return src
	return path.relative(process.cwd(), path.resolve(sourceDir, src)).replace(/\\/g, '/')
}

function isMajorElement($, el) {
	const node = $(el)
	const id = node.attr('id') || ''
	if (/^(search|.*Ov$|.*Pop$|.*Ok$|navmenu|mgrid)$/i.test(id)) return false
	const text = cleanText(node.text())
	if (['HEADER', 'NAV', 'FOOTER', 'SECTION'].includes(String(el.tagName).toUpperCase())) return true
	return !!node.attr('id') && text.length > 20
}

function isTrackedProp(prop) {
	return /^(display|grid-template-columns|align-items|justify-content|gap|background|background-color|background-image|color|font-family|font-size|font-weight|line-height|margin|margin-bottom|padding|border|border-top|border-right|border-bottom|border-left|border-color|border-width|border-style|border-radius|box-shadow|width|height|object-fit)$/.test(prop)
}

function inferName(classList, tag, index) {
	return classList.find((cls) => /(hero|header|footer|menu|category|about|gallery|hours|testimonial|blog|newsletter|contact|chef|reservation)/i.test(cls)) || `${tag}-${index + 1}`
}

function splitClasses(value = '') {
	return String(value).split(/\s+/).map((part) => part.trim()).filter(Boolean)
}

function selectorClasses(selector) {
	return (selector.match(/\.[A-Za-z0-9_-]+/g) || []).map((s) => s.slice(1))
}

function cleanText(value = '') {
	return String(value).replace(/\s+/g, ' ').trim()
}

function walkFiles(dir, acc = []) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name)
		if (entry.isDirectory() && !['node_modules', '.git'].includes(entry.name)) walkFiles(full, acc)
		else if (entry.isFile()) acc.push(full)
	}
	return acc
}

function parseArgs(argv) {
	const out = { _: [] }
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i]
		if (arg.startsWith('--')) {
			const key = arg.slice(2)
			const next = argv[i + 1]
			if (next && !next.startsWith('--')) {
				out[key] = next
				i++
			} else {
				out[key] = true
			}
		} else {
			out._.push(arg)
		}
	}
	return out
}

function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function fail(message) {
	console.error(message)
	process.exit(1)
}
