import { gett } from '$lib/utils/server'
import { redirect } from '@sveltejs/kit'

export async function load({ request, locals, parent, url }) {
	const { me, store } = locals
	try {
		const myOrders = await gett(`orders/my?store=${store?.id}`, request.headers.get('cookie'))
		const myWishlist = await gett(`wishlists/my?store=${store?.id}`, request.headers.get('cookie'))
		const myReviews = await gett(`reviews?store=${store?.id}`, request.headers.get('cookie'))

		return { me: me, myOrders, myWishlist, myReviews }
	} catch (e) {
		if (e.status === 401) {
			throw redirect(307, locals.store?.loginUrl)
		}
	}
}
