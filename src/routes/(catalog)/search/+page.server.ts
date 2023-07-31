import { ProductService } from '$lib/services'
const isServer = import.meta.env.SSR

export const prerender = false

export async function load({ url, params, parent, cookies }) {
	const { store, origin } = await parent()

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
		products: ProductService.searchProducts({
			query: query.toString(),
			storeId: store?.id,
			server: isServer,
			sid: cookies.get('connect.sid')
		}),
		query: query.toString(),
		searchData,
		sort,
		store,
		currentPage
	}
}
