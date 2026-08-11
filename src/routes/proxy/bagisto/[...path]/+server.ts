import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const fallback: RequestHandler = async ({ request, params, url }) => {
	const apiUrl = env.PUBLIC_BAGISTO_API_URL;

	if (!apiUrl) {
		throw error(500, 'PUBLIC_BAGISTO_API_URL is not configured in $env/dynamic/public');
	}

	const path = params.path || '';

	// Ensure apiUrl doesn't end with a slash for clean concatenation
	const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
	const targetUrl = `${baseUrl}/${path}${url.search}`;

	// Forward all headers except 'host', 'connection', and 'accept-encoding'
	const headers = new Headers(request.headers);
	headers.delete('host');
	headers.delete('connection');
	headers.delete('accept-encoding');

	try {
		const fetchOptions: RequestInit = {
			method: request.method,
			headers
		};

		// Only attach body for methods that allow it
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			fetchOptions.body = request.body;
			// Node.js native fetch might require duplex: 'half' for stream bodies
			// @ts-expect-error - duplex is a Node-specific extension to fetch
			fetchOptions.duplex = 'half';
		}

		const response = await fetch(targetUrl, fetchOptions);

		const responseHeaders = new Headers(response.headers);
		responseHeaders.delete('content-encoding');
		responseHeaders.delete('content-length');

		// Return the proxy response
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders
		});
	} catch (err) {
		console.error('Proxy error:', err);
		throw error(502, 'Bad Gateway');
	}
};

export const GET: RequestHandler = fallback;
export const POST: RequestHandler = fallback;
export const PUT: RequestHandler = fallback;
export const PATCH: RequestHandler = fallback;
export const DELETE: RequestHandler = fallback;
export const OPTIONS: RequestHandler = fallback;
