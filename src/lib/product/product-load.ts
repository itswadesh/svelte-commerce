// The core product load turns every failure into "Product not found": a product that does not
// exist, but also a dropped connection, a 5xx from the API or a malformed response. Telling a
// shopper a product does not exist because the network blinked sends them away from something they
// could have bought. The core load swallows the original error, so the product page wraps its
// fetch with `watchProductRequest` and asks afterwards what the product request actually got back.

export type ProductRequestOutcome = number | 'network' | undefined

/** 404 only when the API said the product is not there; anything else is worth a retry. */
export const productFailureStatus = (outcome: ProductRequestOutcome): 404 | 503 => (outcome === 404 ? 404 : 503)

const urlOf = (input: RequestInfo | URL) => (typeof input === 'string' ? input : input instanceof URL ? input.href : input.url)

/**
 * Wraps a load's `fetch` and records the outcome of the request for this product
 * (`/api/products/<slug>`, not its sub-resources such as `/warehouse`). GoCommerce's connector
 * asks `/api/products/slug/<slug>` and then `/sku/<slug>`, behind any proxy path the storefront
 * puts in front of the API (`/gc-api`).
 */
export function watchProductRequest(fetchFn: typeof fetch, slug: string) {
	let outcome: ProductRequestOutcome
	const isProductRequest = (input: RequestInfo | URL) => {
		const path = new URL(urlOf(input), 'http://localhost').pathname
		const at = path.indexOf('/api/products/')
		if (at < 0) return false
		const rest = path.slice(at + '/api/products/'.length).replace(/^(slug|sku)\//, '')
		return !rest.includes('/') && decodeURIComponent(rest) === slug
	}
	// One lookup can take several requests. It is a 404 only if every one of them was, so a failure
	// of any other kind is kept over a later 404.
	const record = (result: number | 'network') => {
		if (outcome === undefined || outcome === 404 || (typeof outcome === 'number' && outcome < 400)) outcome = result
	}
	const watched = (async (input: RequestInfo | URL, init?: RequestInit) => {
		const mine = isProductRequest(input)
		let response: Response
		try {
			response = await fetchFn(input, init)
		} catch (e) {
			// SvelteKit's server-side fetch applies the browser's CORS rule to the engine's answer,
			// and the connector then asks again with Node's own fetch. Asking here instead lets the
			// watcher see the real status; a browser's own fetch never fails with this message.
			if (!mine || !/CORS/i.test(String((e as Error)?.message))) {
				if (mine) record('network')
				throw e
			}
			try {
				response = await globalThis.fetch(input, init)
			} catch (again) {
				record('network')
				throw again
			}
		}
		if (mine) record(response.status)
		return response
	}) as typeof fetch
	return { fetch: watched, outcome: () => outcome }
}
