import type { PageServerLoad } from '../../../../../routes/(legal)/refund-policy/$types'
import { getOnePage } from '../load-page-one.server'

export const load: PageServerLoad = getOnePage('refund-policy')
