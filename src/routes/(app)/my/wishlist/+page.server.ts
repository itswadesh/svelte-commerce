import { WishlistService } from '$lib/services'
import { error, redirect } from '@sveltejs/kit'

export async function load({ cookies, locals }) {
	try {
		const wishlistedProducts = await WishlistService.fetchWishlist({
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('connect.sid')
		})
		if (wishlistedProducts) {
			return { wishlistedProducts }
		}

		throw error(404, 'Wishlist not found')
	} catch (e) {
		if (e.status === 401) {
			throw redirect(307, locals.store?.loginUrl)
		}
	}
}
