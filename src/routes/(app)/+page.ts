import { services } from '@misiki/litekart-utils'

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
			home: services.HomeService.fetchHome({
				origin,
				storeId,
				isCors: store?.isCors,
				sid: sid
			}),
			deals: services.DealsService.fetchDeals({
				origin,
				storeId,
				isCors: store?.isCors,
				sid: sid
			}),
			collections: services.CollectionService.fetchCollections({
				origin,
				storeId,
				isCors: store?.isCors,
				sid: sid
			})
		},
		products: await services.ProductService.fetchProducts({
			query: query.toString(),
			origin,
			storeId,
			isCors: store?.isCors,
			sid: sid
		}),
		currentPage,
		origin,
		query: query.toString(),
		searchData,
		sort,
		store
	}
}