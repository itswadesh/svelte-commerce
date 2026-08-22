import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit'
import { StoreService } from '$lib/core/services'
import { env } from '$env/dynamic/public'
import { getStore } from '@misiki/kitcommerce-core/utils'
import { initActiveConnector } from '$lib/core/connectors/init'

export const init = initActiveConnector

// Function to check if a URL is a local/IP address
function isLocalOrIpAddress(url: string): boolean {
	return url.includes('localhost') || url.includes('127.0.0.1') || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)
}

export const handle: Handle = async ({ event, resolve }) => {
	const url = new URL(event.request.url)
	const isLocalOrIP = isLocalOrIpAddress(url.hostname)

	// The readiness probe must not depend on the store lookup below, or an upstream API blip
	// would pull a perfectly healthy container out of the load balancer.
	if (url.pathname === '/health') {
		return resolve(event)
	}

	if (url.protocol === 'http:' && !isLocalOrIP) {
		event.url.protocol = 'https:'
	}

	const storeId = env.PUBLIC_LITEKART_STORE_ID
	const storeIdFromCookie = event.cookies.get('litekart_store_id')
	if (storeId && storeIdFromCookie !== storeId) {
		event.cookies.set('litekart_store_id', storeId, { path: '/' })
	} else if (!storeIdFromCookie) {
		const domain = env.PUBLIC_LITEKART_DOMAIN || url.hostname
		if (!domain) {
			throw new Error(`Unable to retrieve hostname from URL. ${url.hostname}`)
		}
		if (!url.pathname.startsWith('/api')) {
			const storeService = new StoreService(event.fetch)
			let storeDetails = null
			try {
				// getStore's declared params require storeId, but it resolves by domain alone at
				// runtime — storeId is always undefined on this branch (the guard above handles it).
				storeDetails = await getStore({ storeId: storeId as unknown as string, domain }, storeService)
			} catch (e) {
				// A 404 means "no store maps to this domain" → render a proper 404 page below.
				// Re-throw anything else (API down, network) so it surfaces as a 500 rather than a
				// misleading "store not found".
				// The connector rejects with plain `{ message }` objects, not Error instances, so
				// read the message structurally rather than via `instanceof Error`.
				const message = (e as { message?: string } | null | undefined)?.message || ''
				if (!/not found|404/i.test(message)) {
					throw e
				}
			}
			if (storeDetails?.id) {
				if (storeIdFromCookie !== storeDetails.id) {
					event.cookies.set('litekart_store_id', storeDetails.id, { path: '/' })
				}
				event.locals.storeDetails = storeDetails
			} else {
				event.locals.storeNotFound = true
			}
		}
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => name === 'content-type',
		// SvelteKit emits a `Link: rel=modulepreload` header for EVERY client chunk (107 on the jws
		// PDP). The browser starts all of them before the parser reaches the LCP <img>, saturating the
		// connection and delaying the LCP image request by seconds. resolve_opts.preload is the only
		// filter Kit exposes; its default (`type === 'js' || type === 'css'`) lets everything through.
		// Measured on jws, Pixel 5 / 4x CPU / Slow 4G: LCP-TTFB 4952ms -> 1668ms, with all app JS
		// still finishing within 216ms of before. Dropping js entirely reaches 763ms but delays
		// hydration by 1.1s, which is the worse trade.
		preload: ({ type, path }) => type === 'css' || path.includes('/entry/') || path.includes('/nodes/')
	})
	// response.headers.set('x-litekart-store', storeDetailsCache?.id || '')
	return response
}

// Route server-side API calls straight to the backend (PUBLIC_LITEKART_API_URL) instead of letting
// them hairpin through the public origin. When the storefront is behind a proxy/CDN (e.g. Cloudflare),
// an SSR fetch to a relative `/api/...` resolves to the public hostname and goes back out through the
// CDN from the server's own IP — which the CDN blocks (e.g. Cloudflare returns 403 for datacenter
// traffic), breaking store resolution. Rewriting to the direct backend keeps SSR working regardless of
// the edge, with no extra CDN round-trip. Browser fetches are unaffected (they don't go through this).
export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	const apiBase = env.PUBLIC_LITEKART_API_URL
	if (apiBase) {
		const reqUrl = new URL(request.url)
		if (reqUrl.pathname.startsWith('/api')) {
			const target = new URL(apiBase)
			reqUrl.protocol = target.protocol
			reqUrl.hostname = target.hostname
			reqUrl.port = target.port
			const proxied = new Request(reqUrl, request)
			// Rewriting to the API host makes this cross-origin, so SvelteKit no longer
			// forwards the `litekart_store_id` cookie that identifies the tenant. Without it
			// the API rejects the call with "Store ID is required" and multi-tenant SSR
			// (e.g. *.litekart.in) renders empty. Re-attach the store id explicitly as the
			// header the API also accepts. `handle` has already resolved it into locals (and
			// the cookie) for this request.
			const storeId = event.locals.storeDetails?.id || event.cookies.get('litekart_store_id')
			if (storeId) {
				proxied.headers.set('x-litekart-store', storeId)
			}
			return fetch(proxied)
		}
	}
	return fetch(request)
}

// Shape of the errors SvelteKit hands to `handleError` (a SvelteKitError, an Error, or whatever
// was thrown). `error` is typed `unknown`, so narrow it before reading these.
type ThrownError = { message?: string; stack?: string; status?: number }

// Simplified error handler that strips stack trace information
export const handleError: HandleServerError = ({ error }) => {
	const err = (error ?? {}) as ThrownError

	// Check if it's a SvelteKitError or similar object with stack trace
	if (err.stack && err.status === 404 && !err.message?.startsWith('/cdn/')) {
		// Create a simplified version of the error
		const simplifiedError = err.message || 'An error occurred'

		console.error('Sveltekit error:', simplifiedError)

		// Return the simplified error
		return {
			message: simplifiedError,
			status: err.status
		}
	}

	return {
		message: err.message || 'An unknown error occurred',
		status: err.status || 500
	}
}
