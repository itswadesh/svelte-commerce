import { CollectionService, DealsService, HomeService } from '$lib/services'
const isServer = import.meta.env.SSR

export async function load({ parent }) {
	const { store, origin } = await parent()

	return {
		streamed: {
			home: HomeService.fetchHome({ origin, storeId: store?.id, server: isServer }),

			deals: DealsService.fetchDeals({ origin, storeId: store?.id, server: isServer }),

			collections: CollectionService.fetchCollections({
				origin,
				storeId: store?.id,
				server: isServer
			})
		},

		origin
	}
}
