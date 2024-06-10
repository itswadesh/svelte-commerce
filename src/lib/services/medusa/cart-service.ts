import type { Error } from '$lib/types'
import { getMedusajsApi, postMedusajsApi, deleteMedusajsApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
import { mapMedusajsCart } from './medusa-utils'
import { REGION_ID } from '.'

export const createCart = async ({ region_id = '', sales_channel_id = '' }: any) => {
	let queryParams = []
	if (region_id) queryParams.push(`region_id=${region_id}`)
	if (sales_channel_id) queryParams.push(`sales_channel_id=${sales_channel_id}`)

	let params = ''
	if (queryParams.length > 0) {
		params += `?${queryParams.join('&')}`
	}

	const res = await postMedusajsApi(`carts${params}`, {})
	return res.cart
}

export const fetchCartData = async (cartId: any) => {
	try {
		let res: Object = {}
		res = await getMedusajsApi(`carts/${cartId}`)
		res = res?.cart
		return res || {}
	} catch (err) {
		console.log(err)
	}
}

export const updateCartData = async ({
	cartId,
	billing_address = {},
	shipping_address = {},
	gift_cards,
	discounts
}: any) => {
	try {
		let queryParams = []
		if (!cartId) {
			console.log('cartId missing')
		}
		if (billing_address) queryParams.push(`billing_address=${billing_address}`)
		if (shipping_address) queryParams.push(`shipping_address=${shipping_address}`)
		if (gift_cards) queryParams.push(`gift_cards=${gift_cards}`)
		if (discounts) queryParams.push(`discounts=${discounts}`)

		let params = ''
		if (queryParams.length > 0) {
			params += `?id=${cartId}${queryParams.join('&')}`
		}

		let res: Object = {}
		res = await getMedusajsApi(`carts/${cartId}`)
		res = res?.cart
		return res || {}
	} catch (err) {
		console.log(err)
	}
}

export const completeCart = async ({ cartId }: any) => {
	try {
		let res: Object = {}
		res = await postMedusajsApi(`carts/${cartId}/complete`, {})
		return res || {}
	} catch (err) {
		console.log(err)
	}
}

export const addLineItemtoCart = async ({
	cartId,
	lineId,
	variantId,
	quantity = 0,
	metadata
}: any) => {
	try {
		let res: Object = {}
		res = await postMedusajsApi(`carts/${cartId}/line-items`, {
			quantity: quantity,
			variant_id: variantId
		})
		return res?.cart || {}
	} catch (err) {
		console.log(err)
	}
}

export const updateLineItemtoCart = async ({
	cartId,
	lineId,
	quantity = 0,
	metadata = {}
}: any) => {
	try {
		let res: Object = {}
		res = await postMedusajsApi(`carts/${cartId}/line-items/${lineId}`, {
			quantity: quantity,
			metadata: metadata
		})
		return res?.cart || {}
	} catch (err) {
		console.log(err)
	}
}

export const deleteLineItemCart = async ({ cartId, lineId, quantity = 0 }: any) => {
	try {
		let res: Object = {}
		res = await deleteMedusajsApi(`carts/${cartId}/line-items/${lineId}`)
		return res?.cart || {}
	} catch (err) {
		console.log(err)
	}
}

//Payment Sessions
export const createPaymentSessions = async ({ cartId }: any) => {
	try {
		let res: Object = {}
		res = await postMedusajsApi(`carts/${cartId}/payment-sessions`, {})
		return res?.cart || {}
	} catch (err) {
		console.log(err)
	}
}
export const updatePaymentSessions = async ({ cartId, providerId, data = {} }: any) => {
	try {
		let res: Object = {}
		res = await postMedusajsApi(`carts/${cartId}/payment-sessions/${providerId}`, {
			data: data
		})
		return res?.cart || {}
	} catch (err) {
		console.log(err)
	}
}

export const refreshPaymentSessions = async ({ cartId, providerId }: any) => {
	try {
		let res: Object = {}
		res = await postMedusajsApi(`carts/${cartId}/payment-sessions/${providerId}/refresh`, {})
		return res?.cart || {}
	} catch (err) {
		console.log(err)
	}
}

export const deletePaymentSession = async ({ cartId, providerId }: any) => {
	try {
		let res: Object = {}
		res = await deleteMedusajsApi(`carts/${cartId}/payment-sessions/${providerId}`)
		return res?.cart || {}
	} catch (err) {
		console.log(err)
	}
}

//Shipping
export const addShippingtoCart = async ({ cartId, optionId, data = {} }: any) => {
	try {
		let res: Object = {}
		res = await postMedusajsApi(`carts/${cartId}/shipping-methods`, {
			option_id: optionId,
			data: data
		})

		return res?.cart || {}
	} catch (err) {
		console.log(err)
	}
}

// Third Party Services Utilities
export const calculateCartTaxes = async (cartId: any) => {
	// for services using third party services other than medusa
	try {
		// same as get cart function
		let res: Object = {}
		res = await getMedusajsApi(`carts/${cartId}/taxes`)
		res = res?.cart
		return res || {}
	} catch (err) {
		console.log(err)
	}
}

export const fetchRefreshCart = async ({
	origin,
	storeId,
	cookies,
	cartId,
	server = false,
	sid = null
}: any) => {
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

// export const fetchMyCart = async ({ origin, storeId, server = false, sid = null }: any) => {
// 	try {
// 		let res: any = {}

// 		res = {} // await getMedusajsApi(`cart/me`, {}, sid)

// 		return res || {}
// 	} catch (err) {
// 		error(e.status, e.message)
// 	}
// }

export const addToCartService = async ({
	pid,
	vid,
	qty,
	customizedImg,
	origin,
	storeId,
	server = false,
	cookies,
	sid = null
}: any) => {
	try {
		let cart_id = cookies.get('cartId')

		if (cart_id === undefined || cart_id === 'undefined') {
			cart_id = null
		}

		const body = {
			variant_id: vid || pid,
			quantity: qty
		}

		let res: any = {}

		if (!cart_id) {
			const cartRes = await postMedusajsApi(`carts`, { region_id: REGION_ID }, sid)

			cart_id = cartRes.cart?.id
		}

		const res_data = await postMedusajsApi(`carts/${cart_id}/line-items`, body, sid)

		if (cart_id) {
			const res_cartRes = await postMedusajsApi(`carts/${cart_id}`, { customer_id: res?.id }, sid)
		}

		res = mapMedusajsCart(res_data?.cart)

		return res || {}
	} catch (e) {
		// console.error(e)
		error(e.status, e.message)
	}
}

export const applyCouponService = async ({
	code,
	origin,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`cart/me`, {}, sid)

		return res || {}
	} catch (e) {
		error(e.status, e.message)
	}
}

export const removeCouponService = async ({
	code,
	origin,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`cart/me`, {}, sid)

		return res || {}
	} catch (e) {
		error(e.status, e.message)
	}
}

export const updateCart = async ({
	cartId,
	billingAddress,
	email,
	customer_id,
	shippingAddress,
	cookies,
	sid = null
}: any) => {
	try {
		const body = {
			billing_address: {
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
			},
			shipping_address: {
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
			},
			email: billingAddress.email,
			customer_id
		}
		// console.log('body', body);
		// console.log('cartId', cartId);

		let res: any = {}

		if (cartId) {
			const res_data = await postMedusajsApi(`carts/${cartId}`, body, sid)

			res = mapMedusajsCart(res_data?.cart)

			return res || {}
		}
	} catch (e) {
		// console.error(e)
		error(e.status, e.message)
	}
}
