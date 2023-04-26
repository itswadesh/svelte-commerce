import { error } from '@sveltejs/kit'
import { getWoocommerceApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import type { AllOrders, Error } from '$lib/types'
import { mapWoocommerceOrder, mapWoocommerceAllOrders } from '$lib/utils'

export const fetchOrders = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: AllOrders | {} = {}

		const med = (await getWoocommerceApi(`customers/me/orders`, {}, sid)).product

		return {
			data: res.data || [],
			count: res.count,
			pageSize: res.pageSize,
			noOfPage: res.noOfPage,
			page: res.page
		}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchOrder = async ({ origin, storeId, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		const med = (await getWoocommerceApi(`products`, {}, sid)).product

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchTrackOrder = async ({ origin, storeId, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getWoocommerceApi(`customers/me`, {}, sid)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
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

		res = await getWoocommerceApi(`customers/me`, {}, sid)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const codCheckout = async ({
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

		res = await getWoocommerceApi(`customers/me`, {}, sid)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
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

		res = await getWoocommerceApi(`customers/me`, {}, sid)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
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

		res = await getWoocommerceApi(`customers/me`, {}, sid)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
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

		res = await getWoocommerceApi(`customers/me`, {}, sid)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
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

		res = await getWoocommerceApi(`customers/me`, {}, sid)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
