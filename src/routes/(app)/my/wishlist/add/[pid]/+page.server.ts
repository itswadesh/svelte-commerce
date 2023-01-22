import { checkhWishlist } from '$lib/services/WishlistService'
import {  post } from '$lib/utils/server'
import { redirect } from '@sveltejs/kit'

export async function load({ locals, cookies, params, request }) {
	const pid = params.pid
	const isExistInWishlist = await checkhWishlist({pid,vid:pid,storeId:locals.store?.id,server:true,sid:cookies.get('sid')})

	if (!isExistInWishlist)
		await post(`wishlists/toggle`, { product: pid, variant: pid, store: locals.store?.id }, cookies)
	throw redirect(307, '/my/wishlist')
}
