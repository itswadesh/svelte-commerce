import { ProductService } from '$lib/services'
import { generatePriceRange } from '$lib/utils'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ url, locals, cookies, parent }) {
	const { store } = locals
	let count
	let err
	let facets
	let fl = {}
	let loading = false
	let pageSize
	let products
	let ressss

	const currentPage = +url.searchParams.get('page') || 1
	const query = url.searchParams
	const searchData = url.searchParams.get('q')
	const sort = url.searchParams.get('sort')

	query.forEach(function (value, key) {
		fl[key] = value
	})

	try {
		loading = true

		const res = await ProductService.searchProducts({
			query: query.toString(),
			searchData: searchData,
			server: true,
			sid: cookies.get('connect.sid'),
			storeId: store?.id
		})

		count = res.count
		err = res.err
		facets = res.facets || []
		pageSize = res.pageSize || 40
		products = res.products
		ressss = res
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
		count,
		currentPage,
		err,
		facets,
		fl,
		loading,
		pageSize,
		priceRange,
		products,
		query: query.toString(),
		ressss,
		searchData,
		sort
	}
}
