import { loginUrl } from '$lib/config/index.js'
import { AddressService, CartService, OrdersService, PaymentMethodService } from '$lib/services'
import { redirect } from '@sveltejs/kit'

export const prerender = false

export async function load({ parent, url }) {
	const { me, sid, store, storeId, origin, cartId } = await parent()
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

	const cartRes = await CartService.fetchRefreshCart({
		cartId,
		origin,
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
		} else {
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
