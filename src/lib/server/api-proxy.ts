import { BlockList, isIP } from 'node:net'

// The Litekart connector calls relative `/api/*` from the browser. Under `vite dev` the dev-server
// proxy forwards those to PUBLIC_LITEKART_API_URL, and on Vercel the `vercel.json` rewrite does —
// but the production build runs on adapter-node, where neither exists, so every client-side call
// (menu, related products, delivery options, megamenu) landed on SvelteKit's own HTML 404 page.
// `handle` in hooks.server.ts forwards them here instead, on every platform alike.

export const isApiPath = (pathname: string) => pathname === '/api' || pathname.startsWith('/api/')

// Cloudflare's published ranges, https://www.cloudflare.com/ips/. They change rarely, and a new one
// only means its visitors are counted as that edge until it is listed here.
const cloudflare = new BlockList()
for (const range of ['173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18', '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13', '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22']) {
	const [net, prefix] = range.split('/')
	cloudflare.addSubnet(net, Number(prefix), 'ipv4')
}
for (const range of ['2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32', '2405:8100::/32', '2a06:98c0::/29', '2c0f:f248::/32']) {
	const [net, prefix] = range.split('/')
	cloudflare.addSubnet(net, Number(prefix), 'ipv6')
}

const isCloudflare = (address: string) => {
	const family = isIP(address)
	return family !== 0 && cloudflare.check(address, family === 6 ? 'ipv6' : 'ipv4')
}

/**
 * The shopper's address. Behind Cloudflare the proxy in front of this server heard from Cloudflare's
 * edge, so the shopper is in the header Cloudflare writes. That header is believed only on a request
 * that did come from Cloudflare: a store's own domain may not go through it, and anybody reaching the
 * server directly could otherwise pick the address they are counted as.
 */
export const clientAddress = (event: { getClientAddress: () => string; request?: Request }) => {
	let peer: string
	try {
		peer = event.getClientAddress()
	} catch {
		return undefined
	}
	const shopper = event.request?.headers.get('cf-connecting-ip')?.trim()
	return shopper && isIP(shopper) && isCloudflare(peer) ? shopper : peer
}

// Hop-by-hop headers, plus the edge's own. `api.litekart.in` sits behind Cloudflare too, and a
// request still carrying the storefront zone's `cdn-loop` / `cf-*` headers reads to it as a loop.
// `x-forwarded-for` as the browser sent it, too: proxyApiRequest writes its own.
const DROPPED_REQUEST_HEADERS = ['host', 'connection', 'transfer-encoding', 'keep-alive', 'te', 'trailer', 'upgrade', 'accept-encoding', 'content-length', 'cdn-loop', 'x-forwarded-for']

/**
 * `stripPrefix` is the storefront-side mount, cut off before forwarding: `/backend/api/carts` → `/api/carts`.
 * `clientAddress` is the shopper's, sent as the whole `X-Forwarded-For`. An engine that trusts this server
 * counts its per-address limits (sign-in, order lookup) against it, so a value the browser wrote must never
 * get through: the shopper would pick the address they are counted as.
 */
export const proxyApiRequest = async (
	request: Request,
	apiBase: string,
	fetchFn: typeof fetch = fetch,
	stripPrefix = '',
	clientAddress?: string
): Promise<Response> => {
	const source = new URL(request.url)
	const target = `${apiBase.replace(/\/+$/, '')}${source.pathname.slice(stripPrefix.length)}${source.search}`

	const headers = new Headers(request.headers)
	for (const name of DROPPED_REQUEST_HEADERS) headers.delete(name)
	for (const name of [...headers.keys()]) if (name.startsWith('cf-')) headers.delete(name)
	if (clientAddress) headers.set('x-forwarded-for', clientAddress)

	const init: RequestInit & { duplex?: 'half' } = { method: request.method, headers, redirect: 'manual' }
	if (request.method !== 'GET' && request.method !== 'HEAD') {
		init.body = request.body
		// Node's fetch refuses a streamed body without it.
		init.duplex = 'half'
	}

	try {
		const response = await fetchFn(target, init)
		// fetch has already decoded the body, so the upstream encoding and length no longer describe it.
		const responseHeaders = new Headers(response.headers)
		responseHeaders.delete('content-encoding')
		responseHeaders.delete('content-length')
		return new Response(response.body, { status: response.status, statusText: response.statusText, headers: responseHeaders })
	} catch (err) {
		console.error('API proxy error:', target, err)
		// JSON, so the connector's handleError reads a message rather than choking on an HTML page.
		return new Response(JSON.stringify({ message: 'Unable to reach the server. Please try again in a moment' }), {
			status: 502,
			headers: { 'content-type': 'application/json' }
		})
	}
}
