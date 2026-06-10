import type { Handle, HandleServerError } from '@sveltejs/kit'
import { StoreService, type Store } from '$lib/core/services'
import { env } from '$env/dynamic/public'
import { env as privateEnv } from '$env/dynamic/private'

type ServiceConfigurator = {
	setMedusaPublisableKey?: (key: string) => void
	setRegionId?: (regionId: string | undefined) => void
	setShopifyCredentials?: (domain: string, adminToken: string | undefined, storefrontToken: string | undefined, proxyUrl?: string) => void
}

function getServiceConfigurator(module: unknown): ServiceConfigurator | undefined {
	return typeof module === 'object' && module !== null && 'BaseService' in module
		? (module.BaseService as ServiceConfigurator)
		: undefined
}

function getStatusError(error: unknown): App.Error {
	if (typeof error === 'object' && error !== null) {
		const candidate = error as { message?: unknown; stack?: unknown; status?: unknown }
		return {
			message: typeof candidate.message === 'string' ? candidate.message : 'An unknown error occurred',
			status: typeof candidate.status === 'number' ? candidate.status : 500
		}
	}

	return {
		message: 'An unknown error occurred',
		status: 500
	}
}

// Function to check if a URL is a local/IP address
function isLocalOrIpAddress(url: string): boolean {
	return url.includes('localhost') || url.includes('127.0.0.1') || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)
}

export const init = async () => {
	if (env.PUBLIC_SHOPIFY_STORE_DOMAIN) {
		const configurator = getServiceConfigurator(await import('$lib/core/services'))
		configurator?.setShopifyCredentials?.(
			env.PUBLIC_SHOPIFY_STORE_DOMAIN,
			privateEnv.SHOPIFY_ADMIN_ACCESS_TOKEN,
			env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
		)
	}

	if (env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY) {
		const configurator = getServiceConfigurator(await import('$lib/core/services'))
		configurator?.setMedusaPublisableKey?.(env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY)
		configurator?.setRegionId?.(env.PUBLIC_MEDUSA_REGION_ID)
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
			const storeDetails = (await storeService.getStoreByIdOrDomain({ storeId, domain })) as Store | undefined
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

export const handleError: HandleServerError = ({ error }) => {
	const statusError = getStatusError(error)
	if (statusError.status === 404 && !statusError.message.startsWith('/cdn/')) {
		console.error('Sveltekit error:', statusError.message)
	}

	return statusError
}
