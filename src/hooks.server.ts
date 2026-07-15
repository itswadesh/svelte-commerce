import type { Handle, HandleFetch } from '@sveltejs/kit'
import { StoreService } from '$lib/core/services'
import { env } from '$env/dynamic/public'
import { env as privateEnv } from '$env/dynamic/private'
import { resolveStorefrontTheme } from '$lib/theme/index.js'
import { getThemeHomepageContent } from '$lib/theme/homepage-content.js'
import { stripSupplierBrandFromJson } from '$lib/theme/supplier-brand.js'

/**
 * Baseline security headers. The fleet shipped with none of these.
 *
 * No Content-Security-Policy here on purpose: the storefront loads images from S3/CDN
 * and inlines SvelteKit's hydration script, so a CSP has to be authored per-store
 * against its real asset origins. A wrong CSP breaks the page silently, which is worse
 * than none — so it stays a deliberate, separate piece of work.
 */
const SECURITY_HEADERS: Record<string, string> = {
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'SAMEORIGIN',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
	'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}

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
			const storeDetails = await storeService.getStoreByIdOrDomain({ storeId, domain })
			if (storeDetails?.id && storeIdFromCookie !== storeDetails?.id) {
				event.cookies.set('litekart_store_id', storeDetails?.id, { path: '/' })
				event.locals.storeDetails = storeDetails
			} else {
				throw new Error('Hooks: Store not found.')
			}
		}
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => name === 'content-type'
	})
	// response.headers.set('x-litekart-store', storeDetailsCache?.id || '')

	for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
		if (!response.headers.has(header)) response.headers.set(header, value)
	}

	return response
}

/**
 * Strip the supplier's brand from every API response fetched during SSR.
 *
 * The fleet shares ONE API account, so each product's copy is written in the supplier's
 * voice and their brand reaches the shopper in the PDP <title>, the meta description,
 * the body copy and the PLP tag facets. It cannot be fixed in the backend — one
 * catalogue feeds every store, so any value stored there is wrong for all but one.
 *
 * This is the only hook that can reach the raw upstream responses SvelteKit inlines into
 * the HTML (`data-sveltekit-fetched`) for the client to reuse on hydration; no load's
 * return value can touch those. Rewriting the body HERE, while it is still JSON, is what
 * makes it safe — see the warning in $lib/theme/supplier-brand about rewriting the
 * finished HTML instead, which corrupts the hydration script and silently empties every
 * product grid.
 *
 * Client-side navigations fetch the API straight from the browser and never pass through
 * here, which is why the (www) load functions do the same job for `page.data`.
 */
export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	const response = await fetch(request)

	const brandName = getThemeHomepageContent(resolveStorefrontTheme(undefined)?.name)?.brandName
	if (!brandName) return response
	if (!(response.headers.get('content-type') || '').includes('application/json')) return response

	const body = await response.text()
	const cleaned = stripSupplierBrandFromJson(body, brandName)
	if (cleaned === body) return new Response(body, response)

	// content-length would no longer match the rewritten body, so let it be recomputed.
	const headers = new Headers(response.headers)
	headers.delete('content-length')
	return new Response(cleaned, { status: response.status, statusText: response.statusText, headers })
}

// Simplified error handler that strips stack trace information
export function handleError({ error, event }) {
	// Check if it's a SvelteKitError or similar object with stack trace
	if (error && error.stack && error.status === 404 && !error.message.startsWith('/cdn/')) {
		// Create a simplified version of the error
		const simplifiedError = error.message || 'An error occurred'

		console.error('Sveltekit error:', simplifiedError)

		// Return the simplified error
		return {
			message: simplifiedError.message,
			status: simplifiedError.status
		}
	}

	return {
		message: error?.message || 'An unknown error occurred',
		status: error?.status || 500
	}
}
