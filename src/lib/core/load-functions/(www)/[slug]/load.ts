import { SearchService } from '$lib/core/services'
import type { PageLoad } from '../../../../../routes/(www)/[slug]/$types'

export const load: PageLoad = async ({ url, params, fetch }) => {
	const searchService = new SearchService(fetch)
	try {
		const products = await searchService.searchWithUrl(url, params.slug)
		return { products }
	} catch (e) {
		console.error('Error loading /products:', e)
		return { products: searchService.emptyResult() }
	}
}

