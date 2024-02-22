import { ProductService } from '$lib/services'

export const prerender = false

export async function load({ url, parent }) {
	const { store, storeId, origin, sid } = await parent()
	const currentPage = +url.searchParams.get('page') || 1
	const fl = {}
	const query = url.searchParams || []
	const searchData = url.searchParams.get('q')
	const sort = url.searchParams.get('sort')

	for (const [key, value] of query.entries()) {
		fl[key] = value
	}
	const products = await ProductService.fetchProducts({
		query: query.toString(),
		storeId,
		origin,
		sid
	})
	return {
		products,
		query: query.toString(),
		searchData,
		sort,
		store,
		currentPage
	}
}
