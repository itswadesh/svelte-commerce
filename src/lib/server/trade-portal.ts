// A GoCommerce store's trade portal lives at /portal on the store's own host, and it is the engine's:
// the panel's build calls the engine on its own origin. The proxy in front sends every store host
// here, so this server forwards what the portal needs and nothing else (GoCommerce D231). No proxy
// rule to keep per store, and the shopper's address comes through as on every other forwarded call.

const CART = '[^/]+'

/** Each route the portal reads, by method. A new portal screen that calls another adds it here. */
const ROUTES: ReadonlyArray<readonly [RegExp, RegExp]> = [
	// The shell, its client-side routes and its files.
	[/^(GET|HEAD)$/, /^\/portal(\/|$)/],
	[/^(GET|HEAD)$/, /^\/_panel\//],
	// The two modules it signs in with and buys through. Each route checks its own session.
	[/./, /^\/x\/(b2b|identity)\//],
	// The public routes around them.
	[/^GET$/, /^\/api\/store$/],
	[/^GET$/, new RegExp(`^/api/carts/${CART}$`)],
	[/^(PATCH|DELETE)$/, new RegExp(`^/api/carts/${CART}/line-items/\\d+$`)],
	[/^GET$/, /^\/api\/checkout(\/rates)?$/],
	[/^GET$/, /^\/api\/products\/sku\/[^/]+$/]
]

/**
 * The path as the engine reads it, which decodes before it routes, or null when it would climb out
 * of where it appears to be: `/x/b2b/..%2f..%2fapi/admin` passes for /x/b2b/ here and is not that
 * there. An encoded slash alone stays legal, since a SKU can hold one (`RING%2F22K`).
 */
function asEngineReads(pathname: string): string | null {
	let decoded: string
	try {
		decoded = decodeURIComponent(pathname)
	} catch {
		return null
	}
	return /(^|\/)\.\.?(\/|$)|\\|\0/.test(decoded) ? null : decoded
}

export const isTradePortalRequest = (method: string, pathname: string) =>
	asEngineReads(pathname) !== null && ROUTES.some(([methods, path]) => methods.test(method) && path.test(pathname))

/**
 * What must not be reached through this server under any name: the store's staff API and the
 * engine's own routes for the proxy. Applied to the catch-all /backend mount, which forwards the
 * rest of the engine for the connector's browser calls.
 */
export function isEngineOnlyPath(pathname: string): boolean {
	const path = asEngineReads(pathname)
	return path === null || /^\/+(api\/+admin|internal)(\/|$)/i.test(path)
}

/**
 * The portal's request, naming the store the visitor's host belongs to. The portal's calls carry no
 * store of their own and the engine sees this server as the host, so this is what binds them to the
 * store. What the browser sent is dropped: a page must not pick the store its token is sent to. Its
 * cookies stay here too, since the portal's session is a bearer token and they are the storefront's.
 */
export function tradePortalRequest(request: Request, store: string | undefined): Request {
	const headers = new Headers(request.headers)
	headers.delete('x-litekart-store')
	headers.delete('x-store')
	headers.delete('cookie')
	if (store) headers.set('x-store', store)
	return new Request(request, { headers })
}

export type TradeOffer = { companies: boolean; dealers: boolean }

const NOTHING: TradeOffer = { companies: false, dealers: false }
const TTL_MS = 60_000
const MAX_HOSTS = 1000
const offers = new Map<string, { at: number; offer: Promise<TradeOffer> }>()

/**
 * Whether this store has trade buyers to link and a dealer an enquiry can reach. An engine without
 * the module, or one that does not answer, offers nothing: a missing link is the safe failure, on
 * every page of a retail shop. Remembered per store for a minute, as this is asked on every page.
 */
export function tradeOffer(engine: string | undefined, store: string | undefined, fetchFn: typeof fetch = fetch): Promise<TradeOffer> {
	if (!engine || !store) return Promise.resolve(NOTHING)
	const hit = offers.get(store)
	if (hit && Date.now() - hit.at < TTL_MS) return hit.offer
	const offer = fetchFn(`${engine.replace(/\/+$/, '')}/x/b2b/availability`, {
		headers: { accept: 'application/json', 'x-store': store },
		signal: AbortSignal.timeout(2000)
	})
		.then(async (res) => {
			if (!res.ok) return NOTHING
			const data = (await res.json())?.data
			return { companies: data?.companies === true, dealers: data?.dealers === true }
		})
		.catch(() => NOTHING)
	if (offers.size >= MAX_HOSTS) offers.clear()
	offers.set(store, { at: Date.now(), offer })
	return offer
}
