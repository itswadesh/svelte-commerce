// import { redis } from '$lib/server/redis'
import { DOMAIN, HTTP_ENDPOINT } from '$lib/config'
import { error } from '@sveltejs/kit'
import { CollectionService, DealsService, HomeService } from '$lib/services'

export async function load({ locals }) {
	const { store, origin } = locals

	return {
		streamed: {

			home: HomeService.fetchHome({ storeId: store?.id, server: true }),

			deals: DealsService.fetchDeals({ storeId: store?.id, server: true }),

			collections: CollectionService.fetchCollections({ storeId: store?.id, server: true }),
		},

		origin
	}
}
