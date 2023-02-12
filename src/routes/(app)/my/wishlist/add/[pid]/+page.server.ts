import { checkhWishlist, toggleWishlistService } from '$lib/services/WishlistService'

import { redirect } from '@sveltejs/kit'

export async function load({ locals, cookies, params, request }) {
	const pid = params.pid
	const isExistInWishlist = await checkhWishlist({
		pid,
		vid: pid,
		storeId: locals.store?.id,
		server: true,
		sid: cookies.get('connect.sid')
	})

	if (!isExistInWishlist) {
		await toggleWishlistService({
			pid: pid,
			vid: pid,
			storeId: locals.store?.id,
			sid: cookies.get('connect.sid')
		})
	}
	throw redirect(307, '/my/wishlist')
}
