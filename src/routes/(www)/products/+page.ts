import { error } from '@sveltejs/kit'
import { wwwProductsLoad } from '$lib/core/load-functions/index.js'
import type { PageLoad } from './$types'

// A page past the last one (?page=50 of a 11-product shop) answered 200 with no products and a
// canonical to itself: a soft 404 a search engine reports. The phone's infinite scroll asks the
// search service directly, so it never lands here.
export const load: PageLoad = async (event) => {
	const data = (await wwwProductsLoad(event as never)) as { products?: { data?: unknown[] } }
	if ((Number(event.url.searchParams.get('page')) || 1) > 1 && !data?.products?.data?.length) error(404, 'Not found')
	return data
}
