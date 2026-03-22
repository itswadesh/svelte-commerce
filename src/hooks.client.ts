import { env } from '$env/dynamic/public'
import { BaseService } from '$lib/core/services'

if (env.PUBLIC_SHOPIFY_STORE_DOMAIN) {
  BaseService.setShopifyCredentials(
    env.PUBLIC_SHOPIFY_STORE_DOMAIN,
    '', // Admin token not needed on client
    env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    env.PUBLIC_SHOPIFY_PROXY_URL
  )
}


if (env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY) {
  BaseService.setMedusaPublisableKey(env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY)
  BaseService.setRegionId(env.PUBLIC_MEDUSA_REGION_ID)
}
