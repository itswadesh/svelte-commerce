import { wwwLoad } from '$lib/core/load-functions/index.js'
import { categoryService, productService } from '$lib/core/services/index.js'
import type { PageLoad } from './$types'

// HomepageModule fetches the featured products in a `$effect` and the featured categories in an
// `onMount` — neither runs on the server. The homepage is the highest-authority page on the site
// and the entry point for every crawl, and it was server-rendering no product links, no category
// links and an empty ItemList: a crawler that does not execute JS saw an empty storefront.
// Fetching them here puts them in the SSR HTML. The module keeps owning the load-more accumulator
// and everything else it does on the client.
//
// Failures degrade to an empty list rather than taking the homepage down with them — the page
// already renders empty/loading states for both, and the theme sections around them are static.
export const load: PageLoad = async (event) => {
	const base = await wwwLoad(event)

	const [featuredProducts, featuredCategories] = await Promise.all([
		productService
			.listFeaturedProducts({ page: 1, sort: '-createdAt' })
			.then((r: { data?: unknown[] } | undefined) => r?.data ?? [])
			.catch(() => []),
		categoryService
			.fetchFeaturedCategories({ limit: 18 })
			.then((r: { data?: unknown[] } | undefined) => r?.data ?? [])
			.catch(() => [])
	])

	return { ...base, featuredProducts, featuredCategories }
}
