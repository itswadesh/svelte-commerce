import type { PageServerLoad } from '../../../../../routes/(legal)/about-us/$types'
import { getOnePage } from '../../load-page-one'

export const load: PageServerLoad = getOnePage('about-us')
