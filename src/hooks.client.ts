import { env } from '$env/dynamic/public'

if (env.PUBLIC_SHOPIFY_STORE_DOMAIN) {
  import('$lib/core/services')
    .then(({ BaseService }) => {
      BaseService.setShopifyCredentials(
        env.PUBLIC_SHOPIFY_STORE_DOMAIN,
        '', // Admin token not needed on client
        env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        env.PUBLIC_SHOPIFY_PROXY_URL
      )
    })
}


if (env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY) {
  import('$lib/core/services')
    .then(({ BaseService }) => {
      BaseService.setMedusaPublisableKey(env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY)
      BaseService.setRegionId(env.PUBLIC_MEDUSA_REGION_ID)
    })
}
