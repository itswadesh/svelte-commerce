// import { CartService } from '$lib/services'
import type { RequestEvent } from '@sveltejs/kit'

export const fetchCart = async (event: RequestEvent) => {
	try {
		// const storeId = event.locals.store.id
		// const origin = event.locals.origin
		// console.log('cart.ts............', cartId)
		const sid = event.cookies.get('connect.sid')
		const cartId: string = event.cookies.get('cartId')
		const cartQty: string = event.cookies.get('cartQty')
		if (cartId) event.locals.cartId = cartId
		if (cartQty) event.locals.cartQty = +cartQty
		if (sid) event.locals.sid = sid
		// const cartRes = await CartService.fetchMyCart({ origin, storeId, sid })
		// const cart = {
		// 	cartId: cartRes.cart_id,
		// 	items: cartRes.items,
		// 	qty: cartRes.qty,
		// 	tax: cartRes.tax,
		// 	subtotal: cartRes.subtotal,
		// 	total: cartRes.total,
		// 	currencySymbol: cartRes.currencySymbol,
		// 	discount: cartRes.discount,
		// 	selfTakeout: cartRes.selfTakeout,
		// 	shipping: cartRes.shipping,
		// 	unavailableItems: cartRes.unavailableItems,
		// 	formattedAmount: cartRes.formattedAmount
		// }
		// // event.locals.cartQty = +cart.qty
		// return cart
	} catch (e) {
		return null
	}
}
