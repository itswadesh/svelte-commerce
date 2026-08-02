import { env } from '$env/dynamic/public'

export const init = async () => {
  if (env.PUBLIC_MEDUSA_API_URL) {
    const services = await import('@misiki/kitcommerce-core/services')
    if (!services.BaseService)
      throw new Error("PUBLIC_MEDUSA_API_URL is set but medusaa-connector is not being used")
    console.log("Hook ran", env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY, env.PUBLIC_MEDUSA_API_URL)
    services.BaseService.PUBLISHABLE_KEY = env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY
    services.BaseService.BASE_URL = env.PUBLIC_MEDUSA_API_URL
    services.BaseService.REGION_ID = env.PUBLIC_MEDUSA_REGION_ID
  }
}
