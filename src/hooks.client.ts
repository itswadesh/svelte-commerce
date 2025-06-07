import { env } from '$env/dynamic/public'
import { BaseService } from '@misiki/medusa-connector'

if (env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY) {
  BaseService.setMedusaPublisableKey(env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY)
  BaseService.setRegionId(env.PUBLIC_MEDUSA_REGION_ID)
}
