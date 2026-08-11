import { requireCmsPage } from '../cms-page-load'
import type { PageLoad } from './$types'

export const load: PageLoad = ({ data }) => requireCmsPage(data)
