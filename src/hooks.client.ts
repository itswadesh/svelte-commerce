import { env } from '$env/dynamic/public'

type ServiceConfigurator = {
	setMedusaPublisableKey?: (key: string) => void
	setRegionId?: (regionId: string | undefined) => void
	setShopifyCredentials?: (domain: string, adminToken: string, storefrontToken: string | undefined, proxyUrl?: string) => void
}

function getServiceConfigurator(module: unknown): ServiceConfigurator | undefined {
	return typeof module === 'object' && module !== null && 'BaseService' in module
		? (module.BaseService as ServiceConfigurator)
		: undefined
}

const shopifyStoreDomain = env.PUBLIC_SHOPIFY_STORE_DOMAIN
const medusaPublishableApiKey = env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY

if (shopifyStoreDomain) {
	import('$lib/core/services').then((module) => {
		getServiceConfigurator(module)?.setShopifyCredentials?.(
			shopifyStoreDomain,
			'', // Admin token not needed on client
			env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
			env.PUBLIC_SHOPIFY_PROXY_URL
		)
	})
}

if (medusaPublishableApiKey) {
	import('$lib/core/services').then((module) => {
		const configurator = getServiceConfigurator(module)
		configurator?.setMedusaPublisableKey?.(medusaPublishableApiKey)
		configurator?.setRegionId?.(env.PUBLIC_MEDUSA_REGION_ID)
	})
}
