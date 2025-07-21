import type { PageServerLoad } from '../../../../../routes/(legal)/privacy-policy/$types'
import { getOnePage } from '../load-page-one.server'

export const load: PageServerLoad = getOnePage('privacy-policy')
