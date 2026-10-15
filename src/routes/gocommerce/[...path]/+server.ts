import { env } from '$env/dynamic/public'
import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const DROPPED_HEADERS = ['host', 'connection', 'accept-encoding', 'content-length']

export const fallback: RequestHandler = async ({ request, params, url }) => {
	const apiUrl = env.PUBLIC_GOCOMMERCE_API_URL || 'http://localhost'
	const path = params.path || ''
	const baseUrl = apiUrl.replace(/\/+$/, '')
	const targetUrl = `${baseUrl}/${path}${url.search}`

	const headers = new Headers(request.headers)
	for (const name of DROPPED_HEADERS) {
		headers.delete(name)
	}

	const init: RequestInit & { duplex?: 'half' } = {
		method: request.method,
		headers
	}

	if (request.method !== 'GET' && request.method !== 'HEAD') {
		init.body = request.body
		// Node's native fetch requires duplex: 'half' for streamed request bodies
		init.duplex = 'half'
	}

	try {
		const response = await fetch(targetUrl, init)
		const responseHeaders = new Headers(response.headers)
		responseHeaders.delete('content-encoding')
		responseHeaders.delete('content-length')

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders
		})
	} catch (err) {
		console.error('GoCommerce proxy error:', targetUrl, err)
		throw error(502, 'Bad Gateway: unable to reach GoCommerce engine')
	}
}

export const GET: RequestHandler = fallback
export const POST: RequestHandler = fallback
export const PUT: RequestHandler = fallback
export const PATCH: RequestHandler = fallback
export const DELETE: RequestHandler = fallback
export const OPTIONS: RequestHandler = fallback
