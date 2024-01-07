import { OrdersService, ReviewService, WishlistService } from '$lib/services'
import { redirect } from '@sveltejs/kit'

export async function load({ parent, url }) {
	const { me, sid, storeId, origin } = await parent()

	if (!me || !sid) {
		redirect(307, `/auth/login?ref=${url.pathname}${url.search}`)
	}

	try {
		const orders = await OrdersService.fetchOrders({
			origin,
			sid,
			storeId
		})

		const wishlists = await WishlistService.fetchWishlist({
			origin,
			sid,
			storeId
		})

		const reviews = await ReviewService.fetchReviews({
			origin,
			sid,
			storeId
		})

		return { orders, wishlists, reviews }
	} catch (e) {
		redirect(307, '/auth/login')
	} finally {
	}
}
