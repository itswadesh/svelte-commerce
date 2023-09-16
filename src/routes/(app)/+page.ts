import { CollectionService, DealsService, HomeService } from '$lib/services'

const isServer = import.meta.env.SSR

export async function load({ parent }) {
	const { store, origin } = await parent()
	return {
		streamed: {
			home: HomeService.fetchHome({
				origin,
				server: isServer,
				storeId: store?.id,
				isCors: store?.isCors
			}),

			deals: DealsService.fetchDeals({
				origin,
				server: isServer,
				storeId: store?.id,
				isCors: store?.isCors
			}),

			collections: CollectionService.fetchCollections({
				origin,
				server: isServer,
				storeId: store?.id,
				isCors: store?.isCors
			})
		},

		origin
	}
}
