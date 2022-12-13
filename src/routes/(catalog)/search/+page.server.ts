import { getAPI } from '$lib/util/api'
import { gett } from '$lib/utils'
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
		const res = await gett(`es/products?${query.toString()}&store=${store?.id}`)
		ressss = res
		products = res?.data
		products = products.map((p) => {
			let p1
			p1 = { ...p._source }
			p1.id = p._id
			return p1
		})
		count = res?.count
		facets = res?.facets
		pageSize = res?.pageSize
		err = !res?.estimatedTotalHits ? 'No result Not Found' : null
	} catch (e) {
		err = e
		throw error(400, e?.message || e || 'No results found')
	} finally {
		loading = false
	}
	// cookies.set('cache-control', 'public, max-age=200')

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
