import { OrdersService, ReviewService, WishlistService } from '$lib/services'
import { redirect } from '@sveltejs/kit'

export async function load({ parent, url }) {
	const { me, sid, storeId, origin } = await parent()

	if (!me || !sid) {
		throw redirect(307, `/auth/login?ref=${url.pathname}${url.search}`)
	}

	try {
		const orders = await OrdersService.fetchOrders({
			sid,
			storeId
		})

		const wishlists = await WishlistService.fetchWishlist({
			storeId,
			sid,
			origin
		})

		const reviews = await ReviewService.fetchReviews({
			sid,
			storeId,
			origin
		})
		return { orders, wishlists, reviews }
	} catch (e) {
		throw redirect(307, '/auth/login')
	}
}
