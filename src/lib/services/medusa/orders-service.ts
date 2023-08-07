import { error } from '@sveltejs/kit'
import { getMedusajsApi, postMedusajsApi } from '$lib/utils/server'
import type { AllOrders, Error } from '$lib/types'
import { mapMedusajsAllOrders } from './medusa-utils'

// export const fetchOrders = async ({ origin, storeId, server = false, sid = null }: any) => {
// 	try {
// 		let res: AllOrders | {} = {}

// 		const res = await getMedusajsApi(`customers/me/orders`, {}, sid)
// 		console.log('res', res);
// 		res = mapMedusajsAllOrders(res)
// 		return res || {}
// 	} catch (e) {
// 		throw error(e.status, e.message)
// 	}
// }

export const fetchOrders = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: AllOrders | {} = {}

		res = await getMedusajsApi(`customers/me/orders`, {}, sid)

		return {
			count: res?.count,
			pageSize: res?.limit,
			noOfPage: res?.noOfPage || 1,
			page: res?.page || 1,
			data: res.orders.map((order) => {
				return {
					_id: order.id,
					orderNo: order.id,
					createdAt: order.created_at,
					orderItems: order.items.map((item) => {
						return {
							img: item.thumbnail,
							name: item.title,
							qty: item.quantity,
							price: item.unit_price,
							shippingCharge: item.shipping_total,
							total: item.total,
							status: order.status,
						}
					})
				}
			}) || {}
		}
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const fetchOrder = async ({ origin, storeId, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = (await getMedusajsApi(`orders/${id}`, {}, sid)).order
		// console.log('res', res);

		return {
			id: res?.id,
			orderId: res?.id,
			orderNo: res?.id,
			createdAt: res?.created_at,
			items: res?.items?.map((item) => {
				return {
					slug: item.title.replace(' ', '-').toLowerCase(),
					img: item.thumbnail,
					name: item.title,
					qty: item.quantity,
					price: item.unit_price,
					mrp: item.total,
					brandName: '',
					size: '',
					color: '',
					variant: item.variant,
					total: item.total,

				}
			}),
			address: {
				firstName: res?.shipping_address.first_name,
				lastName: res?.shipping_address.last_name,
				address: res?.shipping_address.address_1,
				locality: res?.shipping_address.address_2,
				city: res?.shipping_address.city,
				country: res?.shipping_address.country_code,
				state: res?.shipping_address.province,
				zip: res?.shipping_address.postal_code,
				phone: res?.shipping_address.phone,
			},
			billingAddress: {
				firstName: res?.shipping_address.first_name,
				lastName: res?.shipping_address.last_name,
				address: res?.shipping_address.address_1,
				locality: res?.shipping_address.address_2,
				city: res?.shipping_address.city,
				country: res?.shipping_address.country_code,
				state: res?.shipping_address.province,
				zip: res?.shipping_address.postal_code,
				phone: res?.shipping_address.phone,
			},
			invoiceLink: '',
			replaceValidTill: '',
			status: res?.status
				|| {}
		}
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const fetchTrackOrder = async ({ origin, storeId, id, server = false, sid = null }: any) => {
	try {
		return []
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const paySuccessPageHit = async ({
	orderId,
	cartId,
	origin,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		if (orderId && orderId != 'undefined') {
			res = await getMedusajsApi(`orders/${orderId}`, {}, sid)
			return res.order || {}
			// return { paymentReferenceId: 'complete', message: 'Order success' }
		} else {
			res = await postMedusajsApi(`carts/${cartId}/complete`, {}, sid)
			return res.data || {}
		}
	} catch (e) {
		console.log('error at medusa cart complete', e)
		// return {}
		throw error(e.status, e.message)
	}
}

export const codCheckout = async ({
	address,
	cartId,
	origin,
	paymentMethod,
	paymentProviderId,
	prescription,
	server = false,
	sid = null,
	storeId
}: any) => {
	try {
		let res: any = {}

		res = await postMedusajsApi(
			`carts/${cartId}/payment-session`,
			{ provider_id: paymentProviderId },
			sid
		)

		// const paymentCartId = res?.cart?.id
		res.id = '' //paymentCartId

		return res
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const cashfreeCheckout = async ({
	address,
	paymentMethod,
	prescription,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`orders/me`, {}, sid)

		return res || {}
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const razorpayCheckout = async ({
	address,
	paymentMethod,
	prescription,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`orders/me`, {}, sid)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const razorpayCapture = async ({
	rpPaymentId,
	rpOrderId,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`orders/me`, {}, sid)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const stripeCheckoutService = async ({
	paymentMethodId,
	address,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`orders/me`, {}, sid)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.message)
	}
}
