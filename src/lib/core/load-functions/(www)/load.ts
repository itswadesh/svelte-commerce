import type { PageLoad } from '../../../../routes/(www)/$types'
import { getOnePage } from '../load-page-one'

export const load: PageLoad = getOnePage('home')
  // let productsRes = []
	// try {
	// 	productsRes = await ProductService.listFeaturedProducts({ page: 1 })
	// } catch (e) {
	// 	console.log(e)a
	// }
	// return {
	// 	products: productsRes.data
	// }
