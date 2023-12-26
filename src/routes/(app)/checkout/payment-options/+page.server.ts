import { AddressService, CartService, OrdersService, PaymentMethodService } from '$lib/services'
import { loginUrl } from '$lib/config/index.js'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async ({ url, request, locals, cookies, depends }) => {
	const { me, sid, store, storeId, origin, cartId } = locals
	let address
	let address_id = url.searchParams.get('address')
	const order_no = url.searchParams.get('order_no')
	let paymentMethods

	// if (!me || !sid) {
	// 	const redirectUrl = `${loginUrl}?ref=${url?.pathname}${url?.search || ''}`
	// 	throw redirect(307, redirectUrl)
	// }

	if (!address_id && !order_no) {
		redirect(307, '/checkout/address')
	}

	const cartRes = await CartService.fetchRefreshCart({
		cartId,
		origin,
		sid,
		storeId
	})

	if (!cartRes?.qty) {
		redirect(307, '/my/orders?sort=-updatedAt')
	}

	const cart = {
		billing_address: cartRes.billing_address,
		cartId: cartRes.cart_id,
		currencySymbol: cartRes.currencySymbol,
		discount: cartRes.discount,
		formattedAmount: cartRes.formattedAmount,
		items: cartRes?.items,
		qty: cartRes.qty,
		savings: cartRes.savings,
		selfTakeout: cartRes.selfTakeout,
		shipping_address: cartRes.shipping_address,
		shipping: cartRes.shipping,
		subtotal: cartRes.subtotal,
		tax: cartRes.tax,
		total: cartRes.total,
		unavailableItems: cartRes.unavailableItems
	}

	try {
		if (order_no) {
			const order = await OrdersService.fetchOrder({
				id: order_no,
				storeId,
				sid,
				origin
			})

			// console.log('order', order);

			if (order) {
				address_id = order.addressId
				address = order.address
			}
		} else if (locals.me) {
			address = await AddressService.fetchAddress({
				id: address_id,
				storeId,
				server: true,
				sid,
				origin
			})
		}

		paymentMethods = await PaymentMethodService.fetchPaymentMethods({
			storeId,
			sid,
			origin
		})

		return { store, paymentMethods, address, addressId: address_id, me, cart }
	} catch (e) {
		// console.log('eeeeeeeeeeeeeeeeeee', e);
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
