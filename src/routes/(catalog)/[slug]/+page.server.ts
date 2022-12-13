import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ url, params, locals, cookies, parent, setHeaders }) {
	// const d1 = new Date()
	const { store } = locals
	// const d2 = new Date()
	// console.log('Got data from Layout page (ms): ', d2.getTime() - d1.getTime())
	let loading = false,
		err,
		count,
		products,
		facets,
		ressss,
		pageSize,
		category

	const fl = {}
	const currentPage = +url.searchParams.get('page') || 1
	const sort = url.searchParams.get('sort')
	const searchData = url.searchParams.get('q')
	const query = url.searchParams
	const categorySlug = params.slug

	query.forEach(function (value, key) {
		fl[key] = value
	})

	let res
	try {
		loading = true
		res = await gett(
			`es/products?categories=${categorySlug}&store=${store?.id}&${query.toString()}`
		)
		products = res?.data?.map((p) => {
			const p1 = { ...p._source }
			p1.id = p._id
			return p1
		})

		count = res?.count
		facets = res?.facets
		pageSize = res?.pageSize
		category = res?.category
		err = !res?.estimatedTotalHits ? 'No result Not Found' : null
	} catch (e) {
		err = e
		throw error(400, e?.message || e || 'No results found')
	} finally {
		loading = false
	}
	// const d3 = new Date()
	// console.log('Product listing page loading complete (ms): ', d3.getTime() - d2.getTime())
	// setHeaders({
	// 	'cache-control': 'public, max-age=7200, must-revalidate'
	// })

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
		ressss,
		category: category,
		store,
		categorySlug,
		origin: locals.origin
	}
}
