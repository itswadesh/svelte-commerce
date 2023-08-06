import { error } from '@sveltejs/kit'
import { getMedusajsApi, postMedusajsApi } from '$lib/utils/server'
import type { AllOrders, Error } from '$lib/types'

export const fetchOrders = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: AllOrders | [] = []

		res = await getMedusajsApi(`customers/me/orders`, {}, sid)
		res.orders.map((o) => {
			o.orderItems = o.items
			return o
		})
		return {
			data: res.orders || [],
			count: res?.count,
			pageSize: res?.limit,
			noOfPage: res?.noOfPage || 1,
			page: res?.page || 1
		}
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const fetchOrder = async ({ origin, storeId, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = (await getMedusajsApi(`orders/${id}`, {}, sid)).order
		return res || {}
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
