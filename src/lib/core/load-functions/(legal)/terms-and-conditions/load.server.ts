import type { PageServerLoad } from '../../../../../routes/(legal)/terms-and-conditions/$types'
import { getOnePage } from '../load-page-one.server'

export const load: PageServerLoad = getOnePage('terms-and-conditions')
