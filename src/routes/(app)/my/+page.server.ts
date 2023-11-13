import { OrdersService, ReviewService, WishlistService } from '$lib/services'
import { error, redirect } from '@sveltejs/kit'

export async function load({ cookies, locals, url }) {
	const { me, sid, store, storeId, origin, isCors } = locals

	if (!me || !sid) {
		throw redirect(307, `/auth/login?ref=${url.pathname}${url.search}`)
	}

	try {
		const orders = await OrdersService.fetchOrders({
			isCors: isCors,
			server: true,
			sid,
			storeId
		})

		const wishlists = await WishlistService.fetchWishlist({
			storeId,
			server: true,
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
