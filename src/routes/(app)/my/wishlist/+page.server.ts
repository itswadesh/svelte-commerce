import { error, redirect } from '@sveltejs/kit'
import { WishlistService } from '$lib/services'

export async function load({ cookies, locals, url }) {
	const { store, storeId, origin, me, sid } = locals

	if (!me || !sid) {
		throw redirect(307, `/auth/login?ref=${url.pathname}${url.search}`)
	}

	try {
		const wishlistedProducts = await WishlistService.fetchWishlist({
			storeId,
			server: true,
			sid,
			origin
		})

		if (wishlistedProducts) {
			return { wishlistedProducts }
		}
	} catch (e) {
		throw redirect(307, '/auth/login')
	}

	throw error(404, 'Wishlist not found')
}

const toggleWishlist = async ({ request, cookies, locals }) => {
	const data = await request.formData()

	const pid = data.get('pid')
	const vid = data.get('vid')

	const { store, origin, me, sid } = locals

	if (!me || !sid) {
		throw redirect(307, `/auth/login?ref=/my/wishlist/add/${pid}`)
	}

	const res = await WishlistService.toggleWishlistService({
		pid: pid,
		vid: vid,
		origin,
		sid,
		storeId
	})

	// console.log('res of toggle wishlist = ', res)

	return res
}

export const actions = { toggleWishlist }
