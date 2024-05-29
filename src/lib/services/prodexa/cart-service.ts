import { error } from '@sveltejs/kit'
import { currency, getAPI, post, put } from '$lib/utils'
import { currencySymbol } from '$lib/config'

const CART_ENDPOINT = 'carts'

const mapCart = (cart) => {
	return {
		...cart,
		qty: cart.quantity,
		items: cart.items?.map(it => {
			const _id = it.catalogId + '___' + it.productId
			return {
				...it,
				_id, slug: _id, pid: _id,
				img: '/prodexa-img' + it.image,
				name: it.shortDescription,
				qty: it.quantity,
				formattedItemAmount: { price: currency(it.price, currencySymbol) }
			}
		}),
		formattedAmount: {
			subtotal: currency(cart.subtotal, currencySymbol),
			total: currency(cart.total, currencySymbol),
			shipping: { value: 0 } // free shipping
		}
	}
}

const loadCart = async ({ cartId = null, origin = null }) => {
	let cart
	try {
		cart = cartId ? await getAPI(`${CART_ENDPOINT}/${cartId}`, origin) : {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
	return cart ? mapCart(cart) : {}
}

export const fetchCartData = loadCart
export const fetchRefreshCart = loadCart
export const fetchMyCart = loadCart

export const addToCartService = async ({ cartId, pid, qty, origin = null }) => {
	try {
		let res: { cart_id?: string, sid?: string } = {}

		res = await post(
			cartId ? `${CART_ENDPOINT}/${cartId}/add` : CART_ENDPOINT,
			{
				catalogId: pid.split('___')[0],
				productId: pid.split('___')[1],
				quantity: qty,
				cart_id: cartId
			},
			origin
		)

		res = { ...res, sid: res.cart_id }
		res = mapCart(res)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const createBackOrder = async ({ pid, qty, origin = null, storeId }) => {
	try {
		let res = {}
		// TODO ...
		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const applyCouponService = async ({ cartId, code, origin, storeId }) => {
	try {
		let res = {}
		// TODO ...
		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const removeCouponService = async ({ cartId, code, origin, storeId }
) => {
	try {
		let res = {}
		// TODO ...
		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const updateCart = async (
	{
		billing_address_id,
		billingAddress,
		cartId = '',
		selfTakeout,
		shipping_address_id,
		origin = null,
		shippingAddress,
		storeId
	}
) => {
	try {
		await put(
			`${CART_ENDPOINT}/${cartId}`,
			{
				billing_address_id,
				billing_address: billingAddress,
				cart_id: cartId,
				selfTakeout,
				shipping_address_id,
				shipping_address: shippingAddress,
				store: storeId
			},
			origin
		)
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const updateCart2 = async (
	{
		cartId,
		selected_products_for_checkout,
		origin = null,
		storeId
	}
) => {
	try {
		let res = {}
		res = await put(
			`${CART_ENDPOINT}/${cartId}`,
			{
				cart_id: cartId,
				selected_products_for_checkout,
				store: storeId
			},
			origin
		)
		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const updateCart3 = async (
	{
		shipping_address,
		billing_address,
		cartId,
		selfTakeout,
		origin = null,
		storeId
	}
) => {
	try {
		let res = {}
		res = await post(
			`${CART_ENDPOINT}/${cartId}`,
			{
				cart_id: cartId,
				selfTakeout,
				shipping_address,
				billing_address,
				store: storeId
			},
			origin
		)
		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
