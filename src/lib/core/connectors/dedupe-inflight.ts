/**
 * Collapse identical in-flight GETs into one request, in the browser only.
 *
 * Several core composables fetch the same thing from their own `onMount`, with no knowledge of
 * each other. Measured on the homepage of this storefront: `/api/products?page=1&limit=200` three
 * times and `/api/categories?flat=true` three times, so four of the eight requests a shopper pays
 * for on first load were duplicates — and two of them were a full 200-product payload. The listing
 * fetches the category tree twice; the product page fetches its own product twice.
 *
 * The callers live in `@misiki/kitcommerce-core`, which this repo does not own, and they import
 * each other by relative specifier, so no alias or `$lib/core` shim can intercept them. What the
 * storefront *can* reach is the connector's own `BaseService.transport()` — the single method every
 * service call gets its fetch from — which this directory already patches for other reasons
 * (`blockRestFallbacks`, `serveRestLocally`). One wrapper there covers every present and future
 * caller instead of chasing each one.
 *
 * Deliberate limits:
 *
 * - **Browser only.** On the server a shared promise would hand one shopper's response to another
 *   request that happened to ask for the same URL in the same tick. Catalogue reads would survive
 *   that; anything carrying a session would not. Not worth the class of bug for a saving that only
 *   exists on the client, where the duplicate `onMount` calls happen.
 * - **In-flight only, never a cache.** The entry is dropped the moment the request settles, so the
 *   next call goes to the network. Nothing goes stale, and no invalidation is needed.
 * - **GET only.** A repeated POST is a second intended write, never a duplicate to collapse.
 * - **Every caller gets its own `Response` clone.** A body can be read once; handing the same
 *   object to two callers would make the second one throw.
 */

type FetchArgs = Parameters<typeof fetch>
type Patchable = { prototype: Record<string, any> }

function keyFor(input: FetchArgs[0], init?: FetchArgs[1]): string | null {
	const method = (init?.method ?? (typeof input === 'object' && 'method' in input ? (input as Request).method : 'GET') ?? 'GET').toUpperCase()
	if (method !== 'GET') return null

	const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url
	if (!url) return null

	// A request carrying its own body or signal is not interchangeable with another that happens to
	// share a URL, so leave those alone.
	if (init?.body) return null
	return `GET ${url}`
}

export function dedupeInflightGets(BaseService: Patchable) {
	if (typeof window === 'undefined') return

	const proto = BaseService?.prototype
	if (!proto || typeof proto.transport !== 'function' || proto.__dedupesInflightGets) return

	const inFlight = new Map<string, Promise<Response>>()
	const originalTransport = proto.transport

	proto.transport = function patchedTransport(this: unknown) {
		const send = originalTransport.call(this) as typeof fetch

		return function dedupedFetch(input: FetchArgs[0], init?: FetchArgs[1]) {
			const key = keyFor(input, init)
			if (!key) return send(input, init)

			const pending = inFlight.get(key)
			if (pending) return pending.then((response) => response.clone())

			const request = send(input, init)
				.then((response) => {
					inFlight.delete(key)
					return response
				})
				.catch((error) => {
					inFlight.delete(key)
					throw error
				})

			inFlight.set(key, request)
			// The originating caller gets a clone too, so the stored response stays unread and every
			// consumer is treated identically.
			return request.then((response) => response.clone())
		} as typeof fetch
	}

	proto.__dedupesInflightGets = true
}
