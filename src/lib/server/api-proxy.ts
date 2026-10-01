// The Litekart connector calls relative `/api/*` from the browser. Under `vite dev` the dev-server
// proxy forwards those to PUBLIC_LITEKART_API_URL, and on Vercel the `vercel.json` rewrite does —
// but the production build runs on adapter-node, where neither exists, so every client-side call
// (menu, related products, delivery options, megamenu) landed on SvelteKit's own HTML 404 page.
// `handle` in hooks.server.ts forwards them here instead, on every platform alike.

export const isApiPath = (pathname: string) => pathname === '/api' || pathname.startsWith('/api/')

// Hop-by-hop headers, plus the edge's own. `api.litekart.in` sits behind Cloudflare too, and a
// request still carrying the storefront zone's `cdn-loop` / `cf-*` headers reads to it as a loop.
const DROPPED_REQUEST_HEADERS = ['host', 'connection', 'accept-encoding', 'content-length', 'cdn-loop']

export const proxyApiRequest = async (request: Request, apiBase: string, fetchFn: typeof fetch = fetch): Promise<Response> => {
	const source = new URL(request.url)
	const target = `${apiBase.replace(/\/+$/, '')}${source.pathname}${source.search}`

	const headers = new Headers(request.headers)
	for (const name of DROPPED_REQUEST_HEADERS) headers.delete(name)
	for (const name of [...headers.keys()]) if (name.startsWith('cf-')) headers.delete(name)

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
