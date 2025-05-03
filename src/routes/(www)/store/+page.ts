import { ProductService } from '$lib/core/services'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch, url }) => {
	const currentPage = +(url.searchParams.get('page') || 1)
	const search = url.searchParams.get('search')
	const sort = url.searchParams.get('sort')

	const productService = new ProductService(fetch)
	const productsRes = await productService.list({
		page: currentPage,
		search: search || undefined,
		sort: sort || undefined
	})
	return {
		products: productsRes.data,
		meta: {
			count: productsRes.count,
			page: productsRes.page,
			pageSize: productsRes.pageSize
		}
	}
}

