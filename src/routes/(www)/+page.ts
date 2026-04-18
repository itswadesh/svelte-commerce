import type { PageLoad } from './$types'
import { getOnePage } from '$lib/core/load-functions/load-page-one'
import { categoryService, productService } from '$lib/core/services'

export const load: PageLoad = async ({ fetch, setHeaders }) => {
	try {
		setHeaders({
			'cache-control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
		})

		// Load page data
		const pageData = getOnePage('home')
		const page = await pageData({ fetch, setHeaders })

		// Load featured products server-side for SSR
		let featuredProducts = []
		let trendingProducts = []
		let featuredCategories = []

		try {
			const [featuredRes, trendingRes, categoriesRes] = await Promise.all([
				productService.listFeaturedProducts({ page: 1, sort: '-createdAt' }),
				productService.listTrendingProducts({ page: 1 }),
				categoryService.fetchFeaturedCategories({ limit: 18 })
			])

			featuredProducts = featuredRes?.data || []
			trendingProducts = trendingRes?.data || []
			featuredCategories = categoriesRes?.data || []
		} catch (error) {
			console.error('Error loading homepage data:', error)
		}

		return {
			...page,
			featuredProducts,
			trendingProducts,
			featuredCategories
		}
	} catch (e: any) {
		console.error(e)
		// Return basic page data even if product loading fails
		const pageData = getOnePage('home')
		const page = await pageData({ fetch, setHeaders })
		return {
			...page,
			featuredProducts: [],
			trendingProducts: [],
			featuredCategories: []
		}
	}
}

