import { env } from '$env/dynamic/public';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const fallback: RequestHandler = async ({ request, params, url: reqUrl }) => {
	const bagistoUrl = env.PUBLIC_BAGISTO_API_URL || 'http://localhost:8000';

	// Map /bagisto-api/[path] to Bagisto's /api/[path]
	const targetPath = `/api/${params.path || ''}`;
	const targetUrl = new URL(targetPath, bagistoUrl);

	// Decode b64 payload if present to preserve clean URL
	let searchParams = reqUrl.searchParams;


	if (searchParams.has('b64')) {
		try {
			const b64 = searchParams.get('b64')!;
			const decoded = decodeURIComponent(Buffer.from(b64, 'base64').toString('utf8'));
			const payload = JSON.parse(decoded);

			// For REST API, append decoded JSON to query params
			for (const [key, value] of Object.entries(payload)) {
				if (typeof value === 'object') {
					searchParams.set(key, JSON.stringify(value));
				} else {
					searchParams.set(key, String(value));
				}
			}

			// Remove the b64 parameter from the forwarded URL
			searchParams.delete('b64');
		} catch (e) {
			console.error("Failed to decode base64 payload in proxy", e);
		}
	}
	targetUrl.search = searchParams.toString();

	try {
		const headers = new Headers(request.headers);
		// Remove host and origin headers to avoid CORS/Host rejection from the target server
		headers.delete('host');
		headers.delete('origin');
		headers.delete('referer');

		const method = request.method;

		const requestInit: RequestInit = {
			method,
			headers,
			// For Node.js standard fetch with body
			duplex: 'half'
		};

		if (request.method !== 'GET' && request.method !== 'HEAD') {
			requestInit.body = await request.arrayBuffer();
		}

		const targetUrlString = targetUrl.toString();
		console.log(`[Proxy] Forwarding ${method} request to: ${targetUrlString}`);
		const response = await fetch(targetUrlString, requestInit as any);
		console.log(`[Proxy] Response from ${targetUrlString}: ${response.status} ${response.statusText}`);

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	} catch (e: any) {
		console.error('Bagisto Proxy Error:', e);
		throw error(500, 'Error connecting to Bagisto backend');
	}
};

export const GET = fallback;
export const POST = fallback;
export const PUT = fallback;
export const PATCH = fallback;
export const DELETE = fallback;
export const OPTIONS = fallback;
