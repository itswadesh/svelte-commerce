import { error } from '@sveltejs/kit'
import { wwwProductsLoad } from '$lib/core/load-functions/index.js'
import { categoryService, popularSearchService, productService } from '$lib/core/services/index.js'
import { popularSearches, topCategories } from '$lib/components/product-catalogue/no-results'
import type { PageLoad } from './$types'

// A page past the last one (?page=50 of a 11-product shop) answered 200 with no products and a
// canonical to itself: a soft 404 a search engine reports. The phone's infinite scroll asks the
// search service directly, so it never lands here.
export const load: PageLoad = async (event) => {
	const data = (await wwwProductsLoad(event as never)) as { products?: { data?: unknown[] } }
	if ((Number(event.url.searchParams.get('page')) || 1) > 1 && !data?.products?.data?.length) error(404, 'Not found')
	if (event.url.searchParams.get('search') && !data?.products?.data?.length) return { ...data, noResults: await noResults() }
	return data
}

// A search that found nothing offers the store's categories, its popular searches and products in its
// own order (no-results.ts), read with the page so nothing shifts in after it is drawn. Each is
// optional: a failure is an empty block, never a failed page.
async function noResults() {
	const svc = popularSearchService as unknown as { list?: (q: object) => Promise<unknown>; listPopularSearch?: (q: object) => Promise<unknown> }
	const [store, searches, recommended] = await Promise.all([
		Promise.resolve(categoryService.getMegamenu()).catch(() => []),
		Promise.resolve(svc.list?.({ page: 1 }) ?? svc.listPopularSearch?.({ page: 1 })).catch(() => null),
		Promise.resolve(productService.list({ page: 1, limit: 8 } as never)).catch(() => null)
	])
	return {
		categories: topCategories(store),
		searches: popularSearches(searches),
		products: ((recommended as any)?.data ?? []).slice(0, 8)
	}
}
