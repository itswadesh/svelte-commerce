import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { startRouteTransition, shouldTransition, productSlugOf } from '$lib/motion/route-transition'

type Call = { named: string[]; finish: () => void; done: Promise<unknown> }

let calls: Call[]

const named = () => [...document.querySelectorAll('[data-vt-morph]')].map((el) => el.id)
const flush = () => new Promise((r) => setTimeout(r, 0))

function installViewTransitions() {
	calls = []
	document.startViewTransition = ((update: () => Promise<void>) => {
		const call = { named: named() } as Call
		const finished = new Promise<void>((resolve) => (call.finish = resolve))
		call.done = Promise.resolve().then(update)
		calls.push(call)
		return { finished: call.done.then(() => finished), ready: call.done, updateCallbackDone: call.done, skipTransition() {} }
	}) as unknown as Document['startViewTransition']
}

const reduce = (on: boolean) =>
	vi.stubGlobal('matchMedia', (query: string) => ({ matches: on && query.includes('reduce'), media: query, addListener() {}, removeListener() {} }))

/** jsdom lays nothing out; give an element a box at `top`. */
function place(el: Element | null, top: number) {
	if (!el) throw new Error('missing element')
	el.getBoundingClientRect = () => ({ top, bottom: top + 100, left: 0, right: 100, width: 100, height: 100, x: 0, y: top, toJSON() {} })
}

/** A navigation whose DOM swap happens when `complete` settles, as SvelteKit's does. */
function navigation(from: string | null, to: string | null, nextHtml?: string, opts: { type?: string; fail?: boolean } = {}) {
	const complete = new Promise<void>((resolve, reject) =>
		setTimeout(() => {
			if (nextHtml !== undefined) document.body.innerHTML = nextHtml
			for (const el of document.querySelectorAll('[data-place]')) place(el, Number((el as HTMLElement).dataset.place))
			if (opts.fail) reject(new Error('navigation aborted'))
			else resolve()
		})
	)
	return {
		type: opts.type ?? 'link',
		from: from ? { url: new URL(from, 'https://shop.test') } : null,
		to: to ? { url: new URL(to, 'https://shop.test') } : null,
		complete
	}
}

const LISTING = `
	<div id="card-a" data-vt-product-media="ring-a" data-place="100"></div>
	<div id="card-b" data-vt-product-media="ring-b" data-place="300"></div>`
const PDP = (related = '') => `<div id="gallery" data-vt-gallery-primary data-place="80"></div>${related}`

function render(html: string) {
	document.body.innerHTML = html
	for (const el of document.querySelectorAll('[data-place]')) place(el, Number((el as HTMLElement).dataset.place))
}

beforeEach(() => {
	installViewTransitions()
	reduce(false)
})

afterEach(() => {
	vi.unstubAllGlobals()
	// @ts-expect-error jsdom has no view transitions; the test installs and removes them
	delete document.startViewTransition
	document.body.innerHTML = ''
})

describe('shouldTransition', () => {
	it('skips browsers without view transitions', () => {
		// @ts-expect-error see afterEach
		delete document.startViewTransition
		expect(shouldTransition(navigation('/products', '/products/ring-a'))).toBe(false)
	})

	it('skips enter, leave and query- or hash-only changes', () => {
		expect(shouldTransition(navigation('/products', '/products/ring-a', undefined, { type: 'enter' }))).toBe(false)
		expect(shouldTransition(navigation('/products?sort=price', '/products?sort=new'))).toBe(false)
		expect(shouldTransition(navigation('/products/ring-a?variant_id=v1', '/products/ring-a?variant_id=v2'))).toBe(false)
		expect(shouldTransition(navigation('/products/ring-a', '/products/ring-a#reviews'))).toBe(false)
	})

	it('runs for a change of page', () => {
		expect(shouldTransition(navigation('/', '/products'))).toBe(true)
	})
})

describe('productSlugOf', () => {
	it('reads product pages only, decoded', () => {
		expect(productSlugOf('/products/ring-a')).toBe('ring-a')
		expect(productSlugOf('/products/bague-%C3%A9toile/')).toBe('bague-étoile')
		expect(productSlugOf('/products')).toBeNull()
		expect(productSlugOf('/categories/rings')).toBeNull()
	})
})

describe('startRouteTransition', () => {
	it('resolves before the DOM update, so SvelteKit can proceed', async () => {
		render(LISTING)
		const nav = navigation('/products', '/products/ring-a', PDP())
		await expect(startRouteTransition(nav)).resolves.toBeUndefined()
		await calls[0].done
	})

	it('morphs the clicked card into the gallery, then clears the names', async () => {
		render(LISTING)
		startRouteTransition(navigation('/products', '/products/ring-a', PDP()))
		await calls[0].done
		expect(calls[0].named).toEqual(['card-a'])
		expect(named()).toEqual(['gallery'])
		calls[0].finish()
		await flush()
		expect(named()).toEqual([])
	})

	it('morphs the gallery back into its card on return', async () => {
		render(PDP())
		startRouteTransition(navigation('/products/ring-b', '/products', LISTING))
		await calls[0].done
		expect(calls[0].named).toEqual(['gallery'])
		expect(named()).toEqual(['card-b'])
	})

	it('names only the clicked related card when one product page opens another', async () => {
		render(PDP('<div id="related-b" data-vt-product-media="ring-b" data-place="600"></div>'))
		startRouteTransition(navigation('/products/ring-a', '/products/ring-b', PDP().replace('gallery', 'gallery-b')))
		await calls[0].done
		expect(calls[0].named).toEqual(['related-b'])
		expect(named()).toEqual(['gallery-b'])
	})

	it('matches an encoded slug', async () => {
		render('<div id="card-e" data-vt-product-media="bague-étoile" data-place="100"></div>')
		startRouteTransition(navigation('/products', '/products/bague-%C3%A9toile', PDP()))
		await calls[0].done
		expect(calls[0].named).toEqual(['card-e'])
	})

	it('no visible card on return means crossfade only', async () => {
		render(PDP())
		startRouteTransition(navigation('/products/ring-a', '/products', LISTING.replace('data-place="100"', 'data-place="5000"')))
		await calls[0].done
		expect(calls.length).toBe(1)
		expect(named()).toEqual([])
	})

	it('a stale transition does not clear a newer one', async () => {
		render(LISTING)
		startRouteTransition(navigation('/products', '/products/ring-a', PDP()))
		await calls[0].done
		startRouteTransition(navigation('/products/ring-a', '/products', LISTING))
		await calls[1].done
		calls[0].finish()
		await flush()
		expect(named()).toEqual(['card-a'])
	})

	it('a failed navigation leaves nothing named and throws nothing', async () => {
		render(LISTING)
		startRouteTransition(navigation('/products', '/products/ring-a', PDP(), { fail: true }))
		await calls[0].done
		calls[0].finish()
		await flush()
		expect(named()).toEqual([])
	})

	it('under reduced motion crossfades without naming anything', async () => {
		reduce(true)
		render(LISTING)
		startRouteTransition(navigation('/products', '/products/ring-a', PDP()))
		await calls[0].done
		expect(calls[0].named).toEqual([])
		expect(named()).toEqual([])
	})
})

describe('startRouteTransition, visibility of both ends', () => {
	it('does not name a gallery that has scrolled out of view', async () => {
		render('<div id="gallery" data-vt-gallery-primary data-place="-2000"></div>')
		startRouteTransition(navigation('/products/ring-a', '/products', LISTING))
		await calls[0].done
		expect(calls[0].named).toEqual([])
		expect(named()).toEqual([])
	})

	it('does not name a card that a carousel has moved sideways out of view', async () => {
		render('<div id="card-a" data-vt-product-media="ring-a"></div>')
		const card = document.getElementById('card-a')!
		card.getBoundingClientRect = () => ({ top: 100, bottom: 200, left: -600, right: -400, width: 200, height: 100, x: -600, y: 100, toJSON() {} })
		startRouteTransition(navigation('/products', '/products/ring-a', PDP()))
		await calls[0].done
		expect(calls[0].named).toEqual([])
	})
})
