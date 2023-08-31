import { loginUrl } from '$lib/config/index.js'
import { AddressService, CartService, PaymentMethodService } from '$lib/services'
import { error, redirect } from '@sveltejs/kit'

export const prerender = false

export async function load({ params, parent, locals, url, request, cookies }) {
	const { me, sid, store, origin } = locals
	const cartId = cookies.get('cartId')

	if (!me || !sid) {
		const redirectUrl = `${loginUrl}?ref=${url?.pathname}${url?.search || ''}`
		throw redirect(307, redirectUrl)
	}

	const cartRes: any = await CartService.fetchRefreshCart({
		storeId: store?.id,
		cartId,
		sid,
		origin: origin
	})

	if (!cartRes?.qty) {
		throw redirect(307, '/my/orders?sort=-updatedAt')
	}

	const cart = {
		cartId: cartRes.cart_id,
		items: cartRes?.items,
		qty: cartRes.qty,
		tax: cartRes.tax,
		subtotal: cartRes.subtotal,
		total: cartRes.total,
		currencySymbol: cartRes.currencySymbol,
		discount: cartRes.discount,
		savings: cartRes.savings,
		selfTakeout: cartRes.selfTakeout,
		shipping: cartRes.shipping,
		unavailableItems: cartRes.unavailableItems,
		formattedAmount: cartRes.formattedAmount
	}

	locals.cart = cart

	try {
		const id = url.searchParams.get('address')

		const address = await AddressService.fetchAddress({
			storeId: locals.store?.id,
			server: true,
			id,
			sid: cookies.get('connect.sid')
		})

		const paymentMethods = await PaymentMethodService.fetchPaymentMethods({
			storeId: locals.store.id,
			server: true,
			sid: cookies.get('connect.sid')
		})

		return { paymentMethods, address, addressId: id, me, cart }
	} catch (e) {
		if (e) {
			throw redirect(307, '/my/orders?sort=-updatedAt')
		}
	}
}
