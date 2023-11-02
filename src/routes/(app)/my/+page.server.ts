import { OrdersService, ReviewService, WishlistService } from '$lib/services'
import { error, redirect } from '@sveltejs/kit'

export async function load({ cookies, locals, url }) {
	const { me, sid, store, origin, isCors } = locals

	if (!me || !sid) {
		throw redirect(307, `/auth/login?ref=${url.pathname}${url.search}`)
	}

	try {
		const orders = await OrdersService.fetchOrders({
			isCors: isCors,
			server: true,
			sid,
			storeId: store?.id
		})

		const wishlists = await WishlistService.fetchWishlist({
			storeId: store?.id,
			server: true,
			sid,
			origin
		})

		const reviews = await ReviewService.fetchReviews({
			sid,
			storeId: store?.id,
			origin
		})
		return { orders, wishlists, reviews }
	} catch (e) {
		throw redirect(307, '/auth/login')
	}
}
