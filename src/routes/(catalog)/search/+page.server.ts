import { searchProducts } from '$lib/services/ProductService'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ url, locals, cookies, parent }) {
	const { store } = locals
	let loading = false,
		err,
		count,
		products,
		style_tags,
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
		const res = await searchProducts({
			storeId: store?.id,
			query: query.toString(),
			searchData: searchData,
			server: true
		})
		ressss = res
		products = res.products
		// style_tags = res.style_tags
		count = res.count
		facets = res.facets || []
		pageSize = res.pageSize || 40
		err = res.err
		if (facets.all_aggs?.tags?.all?.buckets?.length) {
			const style_tags_with_product = facets.all_aggs?.tags?.all?.buckets?.filter(
				(t) => t.doc_count > 0
			)
			style_tags = res?.style_tags.filter((st) => {
				return style_tags_with_product.some((t) => {
					return st._source.name === t.key // Assuming there is a unique "id" property in each object
				})
			})
		}
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
		style_tags,
		pageSize,
		query: query.toString(),
		searchData,
		fl,
		ressss
	}
}
