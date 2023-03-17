import { ProductService } from '$lib/services'
import { generatePriceRange } from '$lib/utils'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ url, locals, cookies, parent }) {
	const { store } = locals
	let loading = false,
		err,
		count,
		products,
		facets,
		pageSize,
		ressss,
		fl = {}

	const currentPage = +url.searchParams.get('page') || 1
	const sort = url.searchParams.get('sort')
	const searchData = url.searchParams.get('q')
	const query = url.searchParams

	query.forEach(function (value, key) {
		fl[key] = value
	})

	try {
		loading = true
		const res = await ProductService.searchProducts({
			storeId: store?.id,
			query: query.toString(),
			searchData: searchData,
			server: true
		})
		ressss = res
		products = res.products
		count = res.count
		facets = res.facets || []
		pageSize = res.pageSize || 40
		err = res.err
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
		loading,
		err,
		currentPage,
		sort,
		products,
		count,
		facets,
		pageSize,
		priceRange,
		query: query.toString(),
		searchData,
		fl,
		ressss
	}
}
