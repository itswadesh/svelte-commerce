import { getAPI } from '$lib/util/api'
import { error, redirect } from '@sveltejs/kit'

export async function load({ request }) {
	try {
		const wishlistedProducts = await getAPI(`wishlists/my`, request.headers)

		if (wishlistedProducts) {
			return { wishlistedProducts }
		}

		throw error(404, 'Wishlist not found')
	} catch (e) {
		if (e.status === 401) {
			throw redirect(307, '/auth/otp-login')
		}
	}
}
