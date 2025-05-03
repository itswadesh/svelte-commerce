import { PageService } from '$lib/core/services'
import type { PageLoad } from '../../../../routes/(www)/$types'

export const load: PageLoad = async ({ fetch }) => {
	try {
		const pageService = new PageService(fetch)
		const page = await pageService.getOne('home')
		return { page }
	} catch (e) {
		console.log(e)
		return { page: {} }
	}
	// let productsRes = []
	// try {
	// 	productsRes = await ProductService.listFeaturedProducts({ page: 1 })
	// } catch (e) {
	// 	console.log(e)a
	// }
	// return {
	// 	products: productsRes.data
	// }
}

