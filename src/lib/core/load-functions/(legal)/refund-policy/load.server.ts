import type { PageServerLoad } from '../../../../../routes/(legal)/refund-policy/$types'
import { getOnePage } from '../../load-page-one'

export const load: PageServerLoad = getOnePage('refund-policy')
