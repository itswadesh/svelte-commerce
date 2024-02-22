import { CollectionService, DealsService, HomeService, ProductService } from '$lib/services'

const isServer = import.meta.env.SSR

export async function load({ params, parent, url }) {
	const { store, storeId, origin, sid } = await parent()
	const currentPage = +url.searchParams.get('page') || 1
	const fl = {}
	const query = url.searchParams
	const searchData = url.searchParams.get('q')
	const sort = url.searchParams.get('sort')

	query.forEach(function (value, key) {
		fl[key] = value
	})

	return {
		streamed: {
			home: HomeService.fetchHome({
				origin,
				storeId,
				sid
			}),
			deals: DealsService.fetchDeals({
				origin,
				storeId,
				sid
			}),
			collections: CollectionService.fetchCollections({
				origin,
				storeId,
				sid
			})
		},
		products: await ProductService.fetchProducts({
			query: query.toString(),
			origin,
			storeId,
			sid
		}),
		currentPage,
		origin,
		query: query.toString(),
		searchData,
		sort,
		store
	}
}
