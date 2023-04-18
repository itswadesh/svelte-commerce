import { error } from '@sveltejs/kit'
import { generatePriceRange } from '$lib/utils'
import { ProductService } from '$lib/services'


export const prerender = false

export async function load({ url, params, locals, cookies, parent, setHeaders }) {
	const { store } = locals
	let category
	let count
	let err
	let facets
	let loading = false
	let pageSize
	let products
	let ressss
	let themeTags

	const categorySlug = params.slug
	const currentPage = +url.searchParams.get('page') || 1
	const fl = {}
	const query = url.searchParams
	const searchData = url.searchParams.get('q')
	const sort = url.searchParams.get('sort')

	query.forEach(function (value, key) {
		fl[key] = value
	})

	let res

	try {
		loading = true
	} catch (e) {
		err = e
		throw error(400, e?.message || e || 'No results found')
	} finally {
		loading = false
	}

	return {
		products: ProductService.fetchProductsOfCategory({
			categorySlug,
			query: query.toString(),
			server: true,
			sid: cookies.get('connect.sid'),
			storeId: store?.id
		}),
		query: query.toString(),
		searchData,
		sort,
		store,
		currentPage
	}
}
