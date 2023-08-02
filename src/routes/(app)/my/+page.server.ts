import { OrdersService, ReviewService, WishlistService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ parent }) {
	const { store, origin, sid } = await parent()

	return {
		streamed: {
			orders: await OrdersService.fetchOrders({
				origin,
				sid,
				storeId: store?.id,
			}),
			wishlists: await WishlistService.fetchWishlist({
				origin,
				sid,
				storeId: store?.id,
			}),
			reviews: await ReviewService.fetchReviews({
				origin,
				sid,
				storeId: store?.id,
			})
		}
	}

}
