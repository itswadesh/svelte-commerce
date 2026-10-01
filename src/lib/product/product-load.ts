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
 * (`/api/products/<slug>`, not its sub-resources such as `/warehouse`).
 */
export function watchProductRequest(fetchFn: typeof fetch, slug: string) {
	let outcome: ProductRequestOutcome
	const isProductRequest = (input: RequestInfo | URL) => {
		const path = new URL(urlOf(input), 'http://localhost').pathname
		if (!path.startsWith('/api/products/')) return false
		const rest = path.slice('/api/products/'.length)
		return !rest.includes('/') && decodeURIComponent(rest) === slug
	}
	const watched = (async (input: RequestInfo | URL, init?: RequestInit) => {
		const mine = isProductRequest(input)
		try {
			const response = await fetchFn(input, init)
			if (mine) outcome = response.status
			return response
		} catch (e) {
			if (mine) outcome = 'network'
			throw e
		}
	}) as typeof fetch
	return { fetch: watched, outcome: () => outcome }
}
