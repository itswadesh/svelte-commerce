import { WishlistService } from '$lib/services'
import { redirect } from '@sveltejs/kit'

export async function load({ locals, cookies, params, request }) {
	try {
		const pid = params.pid
		const storeId = locals.storeId
		const sid = locals.sid
		const isExistInWishlist = await WishlistService.checkWishlist({
			pid,
			vid: pid,
			storeId: locals.storeId,
			origin: locals.origin,
			server: true,
			sid
		})

		if (!isExistInWishlist) {
			await WishlistService.toggleWishlistService({
				pid: pid,
				vid: pid,
				storeId,
				sid,
				origin: locals.origin,
			})
		}

		throw redirect(307, '/my/wishlist')
	} catch (e) {
		throw redirect(307, '/auth/login')
	}
}
