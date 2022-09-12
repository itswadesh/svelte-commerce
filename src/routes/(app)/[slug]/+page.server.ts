import { getAPI } from '$lib/util/api'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ url, params, setHeaders, parent }) {
	const { store } = await parent()
	let loading = false,
		err,
		count,
		products,
		facets,
		ressss,
		fl = {},
		category
	let currentPage = +url.searchParams.get('page') || 1
	let sort = url.searchParams.get('sort')
	let searchData = url.searchParams.get('q')
	let query = url.searchParams

	query.forEach(function (value, key) {
		fl[key] = value
	})

	try {
		loading = true
		const res1 = await getAPI(`es/products?${query.toString()}&store=${store?.id}`)
		ressss = res1
		products = res1?.data
		products = products.map((p) => {
			let p1
			p1 = { ...p._source }
			p1.id = p._id
			return p1
		})
		count = res1?.count
		facets = res1?.facets
		err = !res1?.count ? 'No result Not Found' : null
	} catch (e) {
		err = e
		throw error(400, e?.message || e || 'No results found')
	} finally {
		loading = false
	}

	try {
		loading = true
		const res2 = await getAPI(`categories/${params.slug}?store=${store.id}`)
		// console.log('zzzzzzzzzzzzzzzzzz', res2)
		category = res2
	} catch (e) {
		err = e
	} finally {
		loading = false
	}

	setHeaders({
		'cache-control': 'public, max-age=300'
	})
	return {
		loading,
		err,
		currentPage,
		sort,
		products,
		count,
		facets,
		query: query.toString(),
		searchData,
		fl,
		ressss,
		category
	}
}
