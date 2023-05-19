import { OrdersService, ReviewService, WishlistService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ cookies, locals }) {
	try {
		const orders = await OrdersService.fetchOrders({
			sid: cookies.get('connect.sid'),
			storeId: locals.store?.id
		})

		const wishlists = await WishlistService.fetchWishlist({
			sid: cookies.get('connect.sid'),
			storeId: locals.store?.id
		})

		const reviews = await ReviewService.fetchReviews({
			sid: cookies.get('connect.sid'),
			storeId: locals.store?.id
		})

		return { orders, wishlists, reviews }

	} catch (e) {
		throw error(400, e?.message)
	}
}
