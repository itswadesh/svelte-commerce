import { getAPI } from '$lib/util/api'
import { redirect } from '@sveltejs/kit'

export async function load({ request, parent, url }) {
	const { me, store } = await parent()
	try {
		const myOrders = await getAPI(`orders/my?store=${store?.id}`, request.headers)
		const myWishlist = await getAPI(`wishlists/my?store=${store?.id}`, request.headers)
		const myReviews = await getAPI(`reviews?store=${store?.id}`, request.headers)

		return { me: me, myOrders, myWishlist, myReviews }
	} catch (e) {
		if (e.status === 401) {
			throw redirect(307, '/auth/otp-login')
		}
	}
}
