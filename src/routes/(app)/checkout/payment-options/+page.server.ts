import { loginUrl } from '$lib/config/index.js'
import { AddressService, CartService, OrdersService, PaymentMethodService } from '$lib/services'
import { error, redirect } from '@sveltejs/kit'

export const prerender = false

export async function load({ params, parent, locals, url, request, cookies }) {
	const { me, sid, store, storeId, origin } = locals
	const cartId = cookies.get('cartId')

	let address
	let address_id = url.searchParams.get('address')
	const order_no = url.searchParams.get('order_no')
	let paymentMethods

	if (!me || !sid) {
		const redirectUrl = `${loginUrl}?ref=${url?.pathname}${url?.search || ''}`
		throw redirect(307, redirectUrl)
	}

	if (!address_id && !order_no) {
		throw redirect(307, '/checkout/address')
	}

	const cartRes: any = await CartService.fetchRefreshCart({
		cartId,
		origin: origin,
		sid,
		storeId
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
		if (order_no) {
			const order = await OrdersService.fetchOrder({
				id: order_no,
				storeId: locals.store,
				server: true,
				sid: cookies.get('connect.sid')
			})

			// console.log('order', order);

			if (order) {
				address_id = order.addressId
				address = order.address
			}
		} else {
			address = await AddressService.fetchAddress({
				id: address_id,
				storeId: locals.store,
				server: true,
				sid: cookies.get('connect.sid')
			})
		}

		paymentMethods = await PaymentMethodService.fetchPaymentMethods({
			storeId: locals.store,
			server: true,
			sid: cookies.get('connect.sid')
		})

		return { paymentMethods, address, addressId: address_id, me, cart }
	} catch (e) {
		return {
			paymentMethods,
			address,
			addressId: address_id,
			me,
			cart,
			err: e.data?.message || e.message
		}
	}
}
