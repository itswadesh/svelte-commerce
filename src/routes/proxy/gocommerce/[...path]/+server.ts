import { env } from '$env/dynamic/public'
import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

// The browser's route to the GoCommerce server.
//
// GoCommerce answers with no `Access-Control-Allow-Origin` header and rejects a preflight with 405,
// so a page served from this storefront's origin cannot call it directly — and neither can a
// universal `+page.ts` load, because SvelteKit simulates the same CORS check server-side. Forwarding
// through this route makes every browser-side call same-origin, which needs no cooperation from the
// API at all. Server-side calls skip it and go straight to the API; see `BaseService.apiUrl` in
// @misiki/gocommerce-connector.
//
// This is the same shape as the Bagisto proxy next door. It forwards the method, path, query, body
// and headers unchanged, and adds nothing: the cart token in the url is the shopper's own
// credential and the API is the only thing that judges it.

export const fallback: RequestHandler = async ({ request, params, url }) => {
	const apiUrl = env.PUBLIC_GOCOMMERCE_API_URL

	if (!apiUrl) {
		throw error(500, 'PUBLIC_GOCOMMERCE_API_URL is not configured in $env/dynamic/public')
	}

	const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl
	const targetUrl = `${baseUrl}/${params.path || ''}${url.search}`

	// `host` would name this storefront rather than the API; `connection` and `accept-encoding`
	// belong to the hop, not the request.
	const headers = new Headers(request.headers)
	headers.delete('host')
	headers.delete('connection')
	headers.delete('accept-encoding')

	try {
		const fetchOptions: RequestInit = {
			method: request.method,
			headers
		}

		if (request.method !== 'GET' && request.method !== 'HEAD') {
			fetchOptions.body = request.body
			// Node's fetch requires this to send a stream body.
			// @ts-expect-error - duplex is a Node-specific extension to fetch
			fetchOptions.duplex = 'half'
		}

		const response = await fetch(targetUrl, fetchOptions)

		const responseHeaders = new Headers(response.headers)
		responseHeaders.delete('content-encoding')
		responseHeaders.delete('content-length')

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders
		})
	} catch (err) {
		// "Bad Gateway" on its own says nothing a developer can act on, and this hop fails for exactly
		// one interesting reason: the GoCommerce server is not answering. Name the address that was
		// tried and what the socket said, so a stopped backend reads as a stopped backend instead of
		// an unexplained 502 on every request in the network tab.
		const cause = (err as { cause?: { code?: string } })?.cause?.code ?? (err as Error)?.message ?? 'unknown error'
		const hint =
			new URL(baseUrl).hostname === 'localhost'
				? ' (`localhost` resolves to IPv6 ::1 first on Node — try 127.0.0.1 if the server is listening on IPv4 only)'
				: ''
		console.error(`GoCommerce proxy: could not reach ${baseUrl} — ${cause}`, err)
		throw error(502, `Could not reach the GoCommerce server at ${baseUrl} — ${cause}. Is it running?${hint}`)
	}
}

export const GET: RequestHandler = fallback
export const POST: RequestHandler = fallback
export const PUT: RequestHandler = fallback
export const PATCH: RequestHandler = fallback
export const DELETE: RequestHandler = fallback
export const OPTIONS: RequestHandler = fallback
