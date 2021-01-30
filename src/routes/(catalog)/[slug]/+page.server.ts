import { ProductService } from '$lib/services'
import { currency, generatePriceRange } from '$lib/utils'
import { error } from '@sveltejs/kit'
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

		res = await ProductService.fetchProductsOfCategory({
			categorySlug,
			query: query.toString(),
			server: true,
			sid: cookies.get('connect.sid'),
			storeId: store?.id
		})

		category = res?.category
		count = res?.count
		err = res?.err
		facets = res?.facets
		pageSize = res?.pageSize
		products = res?.products
	} catch (e) {
		err = e
		throw error(400, e?.message || e || 'No results found')
	} finally {
		loading = false
	}

	let priceRange = []
	if (facets.all_aggs?.price_stats?.max > 0 && facets.all_aggs?.price_stats?.min >= 0) {
		priceRange = generatePriceRange(facets.all_aggs?.price_stats)
	}

	return {
		category: category,
		categorySlug,
		count,
		currentPage,
		err,
		facets,
		fl,
		loading,
		origin: locals.origin,
		pageSize,
		priceRange,
		products,
		query: query.toString(),
		ressss,
		searchData,
		sort,
		store
	}
}
