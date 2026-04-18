import { SearchService } from '$lib/core/services'
import type { PageLoad } from '../../../../../routes/(www)/products/$types'

export const load: PageLoad = async ({ url, fetch, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
	})
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

