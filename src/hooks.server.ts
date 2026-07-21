import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit'
import { StoreService } from '$lib/core/services'
import { env } from '$env/dynamic/public'
import { env as privateEnv } from '$env/dynamic/private'

// Function to check if a URL is a local/IP address
function isLocalOrIpAddress(url: string): boolean {
	return url.includes('localhost') || url.includes('127.0.0.1') || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)
}

export const init = async () => {
	if (env.PUBLIC_SHOPIFY_STORE_DOMAIN) {
		const { BaseService } = await import('$lib/core/services')
		BaseService.setShopifyCredentials(
			env.PUBLIC_SHOPIFY_STORE_DOMAIN,
			privateEnv.SHOPIFY_ADMIN_ACCESS_TOKEN,
			env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
		)
	}

  if (env.PUBLIC_SALEOR_API_URL) {
    const { BaseService } = await import('$lib/core/services/index.js')
    BaseService.setCredentials(env.PUBLIC_SALEOR_API_URL)
  }

	if (env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY) {
		const { BaseService } = await import('$lib/core/services')
		BaseService.setMedusaPublisableKey(env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY)
		BaseService.setRegionId(env.PUBLIC_MEDUSA_REGION_ID)
	}
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
				storeDetails = await storeService.getStoreByIdOrDomain({ storeId, domain })
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
		filterSerializedResponseHeaders: (name) => name === 'content-type'
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
export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	const apiBase = env.PUBLIC_LITEKART_API_URL
	if (apiBase) {
		const reqUrl = new URL(request.url)
		if (reqUrl.pathname.startsWith('/api')) {
			const target = new URL(apiBase)
			reqUrl.protocol = target.protocol
			reqUrl.hostname = target.hostname
			reqUrl.port = target.port
			return fetch(new Request(reqUrl, request))
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
