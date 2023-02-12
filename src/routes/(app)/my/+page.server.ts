import { fetchOrders } from '$lib/services/OrdersService'
import { fetchReviews } from '$lib/services/ReviewService'
import { fetchWishlist } from '$lib/services/WishlistService'
import { redirect } from '@sveltejs/kit'

export async function load({ request, locals, parent, cookies }) {
	const { me, store } = locals
	try {
		const myOrders = await fetchOrders({
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('connect.sid')
		})
		const myWishlist = await fetchWishlist({
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('connect.sid')
		})
		const myReviews = await fetchReviews({
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('connect.sid')
		})
		return { me: me, myOrders, myWishlist, myReviews }
	} catch (e) {
		if (e.status === 401) {
			throw redirect(307, locals.store?.loginUrl)
		}
	}
}
