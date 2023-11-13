// import { CartService } from '$lib/services'
import type { RequestEvent } from '@sveltejs/kit'

export const fetchCart = async (event: RequestEvent) => {
	try {
		const sid = event.cookies.get('connect.sid')
		const cartId: string = event.cookies.get('cartId')
		const cartQty: string = event.cookies.get('cartQty')
		if (cartId) event.locals.cartId = cartId
		if (cartQty) event.locals.cartQty = +cartQty
		if (sid) event.locals.sid = sid
	} catch (e) {
		return null
	}
}
