import { getBySid } from '$lib/utils/server'
import type { RequestEvent } from '@sveltejs/kit'

export const fetchCart = async (event: RequestEvent) => {
	try {
		const cartId: string = event.cookies.get('cartId')
		const cartQty: string = event.cookies.get('cartQty')
		event.locals.cartId = cartId
		event.locals.cartQty = +cartQty
		const sid = event.cookies.get('sid')
		const cartRes = await getBySid('carts/my', sid)
		const cart = {
			cartId: cartRes.cart_id,
			items: cartRes.items,
			qty: cartRes.qty,
			tax: cartRes.tax,
			subtotal: cartRes.subtotal,
			total: cartRes.total,
			currencySymbol: cartRes.currencySymbol,
			discount: cartRes.discount,
			selfTakeout: cartRes.selfTakeout,
			shipping: cartRes.shipping,
			unavailableItems: cartRes.unavailableItems,
			formattedAmount: cartRes.formattedAmount
		}
		return cart
	} catch (e) {
		return null
	}
}
