import { ProductService } from '$lib/services'
const isServer = import.meta.env.SSR

export const prerender = false

export async function load({ url, params, parent }) {
	const { store } = await parent()

	const categorySlug = params.slug
	const currentPage = +url.searchParams.get('page') || 1
	const fl = {}
	const query = url.searchParams
	const searchData = url.searchParams.get('q')
	const sort = url.searchParams.get('sort')

	query.forEach(function (value, key) {
		fl[key] = value
	})

	return {
		products: ProductService.fetchProductsOfCategory({
			categorySlug,
			query: query.toString(),
			server: isServer,
			storeId: store?.id
		}),
		query: query.toString(),
		searchData,
		sort,
		store,
		currentPage
	}
}
