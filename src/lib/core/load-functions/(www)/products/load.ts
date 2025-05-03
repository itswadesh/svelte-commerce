import { SearchService } from '$lib/core/services'
import type { PageLoad } from '../../../../../routes/(www)/products/$types'

export const load: PageLoad = async ({ url, fetch }) => {
	const searchService = new SearchService(fetch)
	try {
		const products = await searchService.searchWithUrl(url)
		return { products }
	} catch (e) {
		console.error('Error loading /products:', e)
		return {
			products: searchService.emptyResult()
		}
	}
}

