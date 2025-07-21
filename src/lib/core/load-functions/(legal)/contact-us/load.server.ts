import type { PageServerLoad } from '../../../../../routes/(legal)/contact-us/$types'
import { getOnePage } from '../../load-page-one'

export const load: PageServerLoad = getOnePage('contact-us')
