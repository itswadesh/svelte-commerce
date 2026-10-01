import { isReducedMotion } from './index'

// Wraps a SvelteKit navigation in a view transition: every page change crossfades, and opening a
// product morphs the card image into the product-page gallery (and back). See
// docs/superpowers/specs/2026-10-01-motion-layer-design.md §3.
//
// The morph name is set only here, never in markup: a duplicate `view-transition-name` aborts the
// whole transition, and a product page can hold its own gallery and a related card at once.
// app.css maps the attribute to the name: `[data-vt-morph] { view-transition-name: product-media }`.

export const MORPH_ATTR = 'data-vt-morph'

/** The part of SvelteKit's OnNavigate this needs; `type` stays a string so tests can pass 'enter'. */
export type RouteNavigation = {
	type: string
	from: { url: URL } | null
	to: { url: URL } | null
	complete: Promise<void>
}

const PRODUCT_PATH = /^\/products\/([^/]+)\/?$/

export function productSlugOf(pathname?: string): string | null {
	const match = pathname ? PRODUCT_PATH.exec(pathname) : null
	return match ? decodeURIComponent(match[1]) : null
}

export function shouldTransition(nav: RouteNavigation, doc: Document = document): boolean {
	if (typeof doc.startViewTransition !== 'function') return false
	if (nav.type === 'enter' || nav.type === 'leave') return false
	if (!nav.from || !nav.to) return false
	// Query and hash changes (filters, sort, pagination, ?variant_id, #reviews) keep their own
	// in-place busy states; a whole-page crossfade would fight them.
	return nav.from.url.pathname !== nav.to.url.pathname
}

function clearMorph(doc: Document) {
	for (const el of doc.querySelectorAll(`[${MORPH_ATTR}]`)) el.removeAttribute(MORPH_ATTR)
}

function mark(el: Element | null): boolean {
	if (!el) return false
	el.setAttribute(MORPH_ATTR, '')
	return true
}

function onScreen(el: Element, win: Window | null): boolean {
	const box = el.getBoundingClientRect()
	return box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < (win?.innerHeight ?? Infinity)
}

function cardFor(slug: string, doc: Document): Element | null {
	for (const el of doc.querySelectorAll('[data-vt-product-media]')) {
		if ((el as HTMLElement).dataset.vtProductMedia === slug && onScreen(el, doc.defaultView)) return el
	}
	return null
}

const galleryOf = (doc: Document) => doc.querySelector('[data-vt-gallery-primary]')

// Starting a transition skips the running one, whose `finished` then settles late. Only the newest
// transition may clear names, or the old one strips the morph from the new one mid-flight.
let generation = 0

export function startRouteTransition(nav: RouteNavigation, doc: Document = document): Promise<void> | undefined {
	if (!shouldTransition(nav, doc)) return

	const mine = ++generation
	const toSlug = productSlugOf(nav.to?.url.pathname)
	const fromSlug = productSlugOf(nav.from?.url.pathname)
	const morph = !isReducedMotion()

	clearMorph(doc)
	const hasSource = morph && (toSlug ? mark(cardFor(toSlug, doc)) : fromSlug ? mark(galleryOf(doc)) : false)

	return new Promise((resolve) => {
		const transition = doc.startViewTransition!(async () => {
			resolve()
			// A failed or cancelled navigation still has to let the transition finish cleanly.
			await nav.complete.catch(() => {})
			clearMorph(doc)
			if (hasSource) mark(toSlug ? galleryOf(doc) : fromSlug ? cardFor(fromSlug, doc) : null)
		})
		const cleanUp = () => {
			if (mine === generation) clearMorph(doc)
		}
		transition.ready.catch(() => {})
		transition.finished.then(cleanUp, cleanUp)
	})
}
