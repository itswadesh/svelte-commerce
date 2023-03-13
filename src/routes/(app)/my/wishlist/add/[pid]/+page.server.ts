import {WishlistService } from '$lib/services'

import { redirect } from '@sveltejs/kit'

export async function load({ locals, cookies, params, request }) {
	const pid = params.pid
	const isExistInWishlist = await WishlistService.checkhWishlist({
		pid,
		vid: pid,
		storeId: locals.store?.id,
		server: true,
		sid: cookies.get('connect.sid')
	})

	if (!isExistInWishlist) {
		await WishlistService.toggleWishlistService({
			pid: pid,
			vid: pid,
			storeId: locals.store?.id,
			sid: cookies.get('connect.sid')
		})
	}
	throw redirect(307, '/my/wishlist')
}
