import { CollectionService, DealsService, HomeService, ProductService } from '$lib/services'

const isServer = import.meta.env.SSR

export async function load({ params, parent, url }) {
	const { store, origin, sid } = await parent()

	const categorySlug = params.slug
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
				server: isServer,
				storeId: store?.id,
				isCors: store?.isCors,
				sid: sid
			}),

			deals: DealsService.fetchDeals({
				origin,
				server: isServer,
				storeId: store?.id,
				isCors: store?.isCors,
				sid: sid
			}),

			collections: CollectionService.fetchCollections({
				origin,
				server: isServer,
				storeId: store?.id,
				isCors: store?.isCors,
				sid: sid
			}),
		},
		products: ProductService.searchProducts({
			query: query.toString(),
			origin,
			server: isServer,
			storeId: store?.id,
			isCors: store?.isCors,
			sid: sid
		}),
		currentPage,
		origin,
		query: query.toString(),
		searchData,
		sort,
		store,
	}
}
