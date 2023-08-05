import { error } from '@sveltejs/kit'
import { getMedusajsApi, postMedusajsApi } from '$lib/utils/server'
import type { AllOrders, Error } from '$lib/types'

export const fetchOrders = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: AllOrders | {} = {}

		const med = (await getMedusajsApi(`customers/me/orders`, {}, sid)).orders

		return {
			data: res.data || [],
			count: res.count,
			pageSize: res.pageSize,
			noOfPage: res.noOfPage,
			page: res.page
		}
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const fetchOrder = async ({ origin, storeId, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		const med = (await getMedusajsApi(`products`, {}, sid)).product

		return res || {}
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const fetchTrackOrder = async ({ origin, storeId, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`orders/me`, {}, sid)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const paySuccessPageHit = async ({
	origin,
	paymentMode,
	orderId,
	storeId,
	status,
	id,
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

export const codCheckout = async ({
	address,
	cartId,
	origin,
	paymentMethod,
	paymentProviderId,
	prescription,
	server = false,
	sid = null,
	storeId,
}: any) => {
	try {
		let res: any = {}

		res = await postMedusajsApi(`carts/${cartId}/payment-session`, { provider_id: paymentProviderId }, sid)

		return res || {}
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
