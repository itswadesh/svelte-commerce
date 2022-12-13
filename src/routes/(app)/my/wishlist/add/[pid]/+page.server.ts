import { gett, post } from '$lib/utils'
import { redirect } from '@sveltejs/kit'

export async function load({ locals, cookies, params, request }) {
	const pid = params.pid
	const isExistInWishlist = await gett(
		`wishlists/check?product=${pid}&variant=${pid}&store=${locals.store?.id}`,
		request.headers.get('cookie')
	)
	if (!isExistInWishlist)
		await post(`wishlists/toggle`, { product: pid, variant: pid, store: locals.store?.id }, cookies)
	throw redirect(307, '/my/wishlist')
}
