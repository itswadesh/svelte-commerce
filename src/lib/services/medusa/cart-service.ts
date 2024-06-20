import type { Error } from '$lib/types'
import { deleteMedusajsApi, getMedusajsApi, postMedusajsApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
import { mapMedusajsCart } from './medusa-utils'
import { REGION_ID } from '.'

export const fetchCartData = async ({ origin, storeId, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`cart`, {}, sid)

		return res || {}
	} catch (err) {
		const e = err as Error
		error(e.status, e.data.message)
	}
}

export const fetchRefreshCart = async ({ origin, storeId, cookies, cartId, sid = null }: any) => {
	try {
		let res: any = {}
		const cart_id = cartId
		if (!cart_id || cart_id == 'undefined') return []

		const cartRes = await getMedusajsApi(`carts/${cart_id}`)
		res = mapMedusajsCart(cartRes?.cart)

		return res || {}
	} catch (e) {
		error(e.status, e.message)
	}
}

export const fetchMyCart = async ({ origin, storeId, sid = null }: any) => {
	try {
		let res: any = {}

		res = {} // await getMedusajsApi(`cart/me`, {}, sid)

		return res || {}
	} catch (err) {
		error(e.status, e.message)
	}
}

export const addToCartService = async ({
	pid,
	vid,
	qty,
	cartId,
	line_id = null,
	sid = null
}: any) => {
	try {
		if (cartId === undefined || cartId === 'undefined') {
			cartId = null
		}

		const body = { variant_id: vid || pid, quantity: qty }

		let res: any = {}
		if (!cartId) {
			const cartRes = await postMedusajsApi(`carts`, { region_id: REGION_ID }, sid)
			cartId = cartRes.cart?.id
		}
		let res_data
		if (body.quantity == -9999999) {
			res_data = await deleteMedusajsApi(`carts/${cartId}/line-items/${line_id}`)
		} else {
			res_data = await postMedusajsApi(`carts/${cartId}/line-items`, body, sid)
		}
		if (cartId) {
			await postMedusajsApi(`carts/${cartId}`, { customer_id: res?.id }, sid)
		}

		res = mapMedusajsCart(res_data?.cart)

		return res || {}
	} catch (e) {
		// console.log(e)
		error(e.status, e.message)
	}
}

export const applyCouponService = async ({ code, origin, storeId, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`cart/me`, {}, sid)

		return res || {}
	} catch (e) {
		error(e.status, e.message)
	}
}

export const removeCouponService = async ({ code, origin, storeId, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`cart/me`, {}, sid)

		return res || {}
	} catch (e) {
		error(e.status, e.message)
	}
}

export const updateCart2 = async ({
	cartId,
	billingAddress,
	customer_id,
	shippingAddress,
	sid = null
}: any) => {
	try {
		const body: any = {
			customer_id
		}
		if (billingAddress) {
			body.billing_address = {
				address_1: billingAddress.address_1,
				address_2: billingAddress.address_2,
				city: billingAddress.city,
				// country_code: billingAddress.country_code,
				country_code: billingAddress.country || 'in',
				first_name: billingAddress.first_name,
				landmark: billingAddress.landmark,
				last_name: billingAddress.last_name,
				phone: billingAddress.phone,
				postal_code: billingAddress.postal_code,
				province: billingAddress.province
			}
			body.email = billingAddress.email
		}
		if (shippingAddress) {
			body.shipping_address = {
				address_1: shippingAddress.address_1,
				address_2: shippingAddress.address_2,
				city: shippingAddress.city,
				// country_code: shippingAddress.country_code,
				country_code: shippingAddress.country || 'in',
				first_name: shippingAddress.first_name,
				landmark: shippingAddress.landmark,
				last_name: shippingAddress.last_name,
				phone: shippingAddress.phone,
				postal_code: shippingAddress.postal_code,
				province: shippingAddress.province
			}
		}
		console.log('body', body)

		let res: any = {}

		if (cartId) {
			const res_data = await postMedusajsApi(`carts/${cartId}`, body, sid)

			res = mapMedusajsCart(res_data?.cart)

			return res || {}
		}
	} catch (e) {
		error(e.status, e.message)
	}
}
export const updateCart = async ({
	cartId,
	billingAddress,
	customer_id,
	shippingAddress,
	sid = null
}: any) => {
	try {
		const body: any = {
			customer_id
		}
		if (billingAddress) {
			body.billing_address = {
				address_1: billingAddress.address_1,
				address_2: billingAddress.address_2,
				city: billingAddress.city,
				// country_code: billingAddress.country_code,
				country_code: billingAddress.country || 'in',
				first_name: billingAddress.first_name,
				landmark: billingAddress.landmark,
				last_name: billingAddress.last_name,
				phone: billingAddress.phone,
				postal_code: billingAddress.postal_code,
				province: billingAddress.province
			}
			body.email = billingAddress.email
		}
		if (shippingAddress) {
			body.shipping_address = {
				address_1: shippingAddress.address_1,
				address_2: shippingAddress.address_2,
				city: shippingAddress.city,
				// country_code: shippingAddress.country_code,
				country_code: shippingAddress.country || 'in',
				first_name: shippingAddress.first_name,
				landmark: shippingAddress.landmark,
				last_name: shippingAddress.last_name,
				phone: shippingAddress.phone,
				postal_code: shippingAddress.postal_code,
				province: shippingAddress.province
			}
		}
		console.log('body', body)

		let res: any = {}

		if (cartId) {
			const res_data = await postMedusajsApi(`carts/${cartId}`, body, sid)

			res = mapMedusajsCart(res_data?.cart)

			return res || {}
		}
	} catch (e) {
		error(e.status, e.message)
	}
}
