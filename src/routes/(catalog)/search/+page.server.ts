import { searchProducts } from '$lib/services/ProductService'
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
		const res = await searchProducts({ storeId: store?.id, query: query.toString(), server: true })
		ressss = res
		products = res.products
		count = res.count
		facets = res.facets
		pageSize = res.pageSize
		err = res.err
	} catch (e) {
		err = e
		throw error(400, e?.message || e || 'No results found')
	} finally {
		loading = false
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
		query: query.toString(),
		searchData,
		fl,
		ressss
	}
}
