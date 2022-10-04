import { gett } from '$lib/utils'
import { redirect } from '@sveltejs/kit'

export async function load({ request, parent, url }) {
	const { me, store } = await parent()
	try {
		const myOrders = await gett(`orders/my?store=${store?.id}`, request.headers)
		const myWishlist = await gett(`wishlists/my?store=${store?.id}`, request.headers)
		const myReviews = await gett(`reviews?store=${store?.id}`, request.headers)

		return { me: me, myOrders, myWishlist, myReviews }
	} catch (e) {
		if (e.status === 401) {
			throw redirect(307, '/auth/otp-login')
		}
	}
}
