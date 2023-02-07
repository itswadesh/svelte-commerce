import { getBySid } from '$lib/utils/server'
import type { RequestEvent } from '@sveltejs/kit'

export const fetchCart = async (event: RequestEvent) => {
	try {
		const cartId: string | undefined = event.cookies.get('cartId')
		const cartQty: string | undefined = event.cookies.get('cartQty')
		if (cartId) event.locals.cartId = cartId
		if (cartQty) event.locals.cartQty = +cartQty
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
