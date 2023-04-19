import { WishlistService } from '$lib/services'
import { redirect } from '@sveltejs/kit'

export async function load({ locals, cookies, params, request }) {
	const pid = params.pid
	const storeId = locals.store?.id
	const sid = locals.sid
	const isExistInWishlist = await WishlistService.checkWishlist({
		pid,
		vid: pid,
		storeId: locals.store?.id,
		server: true,
		sid
	})

	if (!isExistInWishlist) {
		await WishlistService.toggleWishlistService({
			pid: pid,
			vid: pid,
			storeId,
			sid,
			server: true
		})
	}
	throw redirect(307, '/my/wishlist')
}
