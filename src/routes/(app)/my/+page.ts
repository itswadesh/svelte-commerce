import { OrdersService, WishlistService, ReviewService } from '$lib/services'
import { redirect } from '@sveltejs/kit'

export async function load({ parent, url }) {
	const { me, sid, storeId, origin } = await parent()

	if (!me || !sid) {
		redirect(307, `/auth/login?ref=${url.pathname}${url.search}`)
	}

	let orders = []
	let wishlists = []
	let reviews = []

	const promises = [
		OrdersService.fetchOrders({
			origin,
			sid,
			storeId
		}),
		WishlistService.fetchWishlist({
			origin,
			sid,
			storeId
		}),
		ReviewService.fetchReviews({
			origin,
			sid,
			storeId
		})
	]

	await Promise.allSettled(promises).then((results) => {
		const res1 = results[0]
		const res2 = results[1]
		const res3 = results[2]
		if (res1.status === 'fulfilled') {
			orders = res1.value
		} else {
			console.error('Error fetching orders:', res1.reason)
			redirect(307, '/auth/login')
		}
		if (res2.status === 'fulfilled') {
			wishlists = res2.value
		} else {
			console.error('Error fetching products:', res2.reason)
		}
		if (res3.status === 'fulfilled') {
			reviews = res3.value
		} else {
			console.error('Error fetching products:', res3.reason)
		}
	})

	return { orders, wishlists, reviews }
}
