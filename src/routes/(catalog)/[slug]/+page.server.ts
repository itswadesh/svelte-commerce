import { fetchProductsOfCategory } from '$lib/services/ProductService'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ url, params, locals, cookies, parent, setHeaders }) {
	const { store } = locals
	let loading = false,
		err,
		count,
		products,
		facets,
		ressss,
		pageSize,
		category,
		style_tags = []

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
		res = await fetchProductsOfCategory({
			storeId: store?.id,
			query: query.toString(),
			categorySlug,
			server: true
		})
		products = res?.products
		count = res?.count
		facets = res?.facets
		// style_tags = res?.style_tags
		pageSize = res?.pageSize
		category = res?.category
		err = res?.err
		if (facets.all_aggs?.tags?.all?.buckets?.length) {
			const style_tags_with_product = facets.all_aggs?.tags?.all?.buckets?.filter(
				(t) => t.doc_count > 0
			)
			style_tags = res?.style_tags?.filter((st) => {
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
		pageSize,
		query: query.toString(),
		searchData,
		fl,
		ressss,
		category: category,
		style_tags,
		store,
		categorySlug,
		origin: locals.origin
	}
}
