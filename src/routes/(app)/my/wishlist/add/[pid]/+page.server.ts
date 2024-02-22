import { redirect } from '@sveltejs/kit'
import { services } from '@misiki/litekart-utils'

export async function load({ locals, cookies, params, request }) {
	try {
		const pid = params.pid
		const storeId = locals.storeId
		const sid = locals.sid
		const isExistInWishlist = await services.WishlistService.checkWishlist({
			pid,
			vid: pid,
			storeId: locals.storeId,
			origin: locals.origin,
			sid
		})

		if (!isExistInWishlist) {
			await services.WishlistService.toggleWishlistService({
				pid: pid,
				vid: pid,
				storeId,
				sid,
				origin: locals.origin
			})
		}

		redirect(307, '/my/wishlist')
	} catch (e) {
		if (e.status === 307 && e.location) {
			redirect(307, e.location)
		} else if (e.status === 401) {
			redirect(307, '/auth/login')
		}
	}
}
