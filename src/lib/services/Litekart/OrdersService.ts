import { error } from '@sveltejs/kit'
import { getAPI, post } from '$lib/utils/api'
import { getBySid, postBySid } from '$lib/utils/server'
import type { AllOrders, Error } from '$lib/types'

export const fetchOrders = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: AllOrders | {} = {}

		if (server) {
			res = await getBySid(`orders/my?store=${storeId}&active=true`, sid)
		} else {
			res = await getAPI(`orders/my?store=${storeId}&active=true`, origin)
		}

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

		if (server) {
			res = await getBySid(`orders/${id}?store=${storeId}`, sid)
		} else {
			res = await getAPI(`orders/${id}?store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchTrackOrder = async ({ origin, storeId, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await getBySid(`order-tracking?order=${id}&store=${storeId}`, sid)
		} else {
			res = await getAPI(`order-tracking?order=${id}&store=${storeId}`, origin)
		}

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

		if (server) {
			res = await postBySid(
				`orders/pay-sucess-page-hit`,
				{
					paymentMode,
					status,
					orderId,
					store: storeId
				},
				sid
			)
		} else {
			res = await post(
				`orders/pay-sucess-page-hit`,
				{
					paymentMode,
					status,
					orderId,
					store: storeId
				},
				origin
			)
		}

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

		res = await post(
			`orders/checkout/cod`,
			{
				address,
				paymentMethod,
				prescription,
				store: storeId
			},
			origin
		)

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

		res = await post(
			`payments/checkout-cf`,
			{
				address,
				prescription,
				store: storeId
			},
			origin
		)

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

		res = await post(
			`payments/checkout-rp`,
			{
				address,
				paymentMethod,
				prescription,
				store: storeId
			},
			origin
		)

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

		res = await post(
			`payments/capture-rp`,
			{
				rpPaymentId,
				rpOrderId,
				store: storeId
			},
			origin
		)

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

		res = await post(
			`stripe`,
			{
				paymentMethodId,
				address,
				store: storeId
			},
			origin
		)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
