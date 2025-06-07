import type { Handle } from '@sveltejs/kit'
import { StoreService } from '$lib/core/services'
import { env } from '$env/dynamic/public'
import { BaseService, PUBLIC_MEDUSA_API_PREFIX } from '@misiki/medusa-connector'
import { PUBLIC_MEDUSA_REGION_ID, PUBLIC_MEDUSA_PUBLISHABLE_API_KEY } from '$env/static/public'

// Function to check if a URL is a local/IP address
function isLocalOrIpAddress(url: string): boolean {
	return url.includes('localhost') || url.includes('127.0.0.1') || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)
}

export const init = async () => {
  console.log("BaseService key",PUBLIC_MEDUSA_PUBLISHABLE_API_KEY)
  if (PUBLIC_MEDUSA_PUBLISHABLE_API_KEY) {
    console.log("setting BaseService key")
    BaseService.setMedusaPublisableKey(PUBLIC_MEDUSA_PUBLISHABLE_API_KEY)
    BaseService.setRegionId(PUBLIC_MEDUSA_REGION_ID)
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
			// console.log(`PUBLIC_LITEKART_STORE_ID = ${storeId}, PUBLIC_LITEKART_DOMAIN = ${env.PUBLIC_LITEKART_DOMAIN}, URL.HOSTNAME = ${url.hostname}`)
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
	return response
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
	console.log(error, 'error')

	return {
		message: error?.message || 'An unknown error occurred',
		status: error?.status || 500
	}
}

