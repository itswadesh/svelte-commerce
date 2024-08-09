import type { PageServerLoad } from '../../../../../routes/(legal)/shipping-policy/$types'
import { getOnePage } from '../load-page-one.server'

export const load: PageServerLoad = getOnePage('shipping-policy')
