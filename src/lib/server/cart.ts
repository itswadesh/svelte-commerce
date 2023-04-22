import { CartService } from '$lib/services'
import type { RequestEvent } from '@sveltejs/kit'

export const fetchCart = async (event: RequestEvent) => {
	try {
		const sid = event.cookies.get('connect.sid')
		const storeId = event.locals.store.id
		const origin = event.locals.origin
		const cartId: string | undefined = event.cookies.get('cartId')
		const cartQty: string | undefined = event.cookies.get('cartQty')
		if (cartId) event.locals.cartId = cartId
		if (cartQty) event.locals.cartQty = +cartQty
		const cartRes = await CartService.fetchMyCart({ origin, storeId, sid })
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
		// event.locals.cartQty = +cart.qty
		return cart
	} catch (e) {
		return null
	}
}
