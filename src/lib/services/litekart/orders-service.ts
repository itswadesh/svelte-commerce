import { error } from '@sveltejs/kit'
import { getAPI, post } from '$lib/utils/api'
import { getBySid, postBySid } from '$lib/utils/server'
import type { AllOrders } from '$lib/types'
const isServer = import.meta.env.SSR

export const fetchOrders = async ({ origin, storeId, sid = null }: any) => {
	try {
		let res: AllOrders | {} = {}

		if (isServer) {
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

export const fetchOrder = async ({ origin, storeId, id, sid = null }: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`orders/${id}?store=${storeId}`, sid)
		} else {
			res = await getAPI(`orders/${id}?store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchTrackOrder = async ({ origin, storeId, id, sid = null }: any) => {
	try {
		let res: any = {}

		if (isServer) {
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
	paymentReferenceId,
	storeId,
	status,
	sid = null
}: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await postBySid(
				`orders/pay-sucess-page-hit`,
				{
					paymentMode,
					status,
					orderId,
					paymentReferenceId,
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
		throw error(e?.status, e?.message)
	}
}

export const codCheckout = async ({
	address,
	cartId,
	origin,
	paymentMethod,
	paymentProviderId,
	prescription,
	storeId
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
		throw error(e.status, e?.message)
	}
}

export const phonepeCheckout = async ({
	address,
	paymentMethod,
	prescription,
	storeId,
	origin,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`checkout/phonepe`,
			{
				address,
				prescription,
				store: storeId,
				return_url: `${origin}/payment/success`
			},
			origin
		)

		return res || {}
	} catch (e) {
		throw error(e.status, e.message?.message || e.message)
	}
}

export const cashfreeCheckout = async ({
	address,
	prescription,
	storeId,
	origin,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`checkout/cashfree`,
			{
				address,
				prescription,
				store: storeId,
				domain: origin,
				return_url: `${origin}/payment/process-cf`
			},
			origin
		)

		return res || {}
	} catch (e) {
		throw error(e.status, e.message?.message || e.message)
	}
}

export const cashfreeCapture = async ({ order_no, storeId, origin, sid }: any) => {
	try {
		let res: any = {}

		res = await postBySid(
			`checkout/cashfree-capture`,
			{
				order_no,
				store: storeId,
				domain: origin
			},
			sid
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
			`checkout/razorpay`,
			{
				address,
				paymentMethod,
				prescription,
				store: storeId,
				domain: origin,
				return_url: `${origin}/payment/success`
			},
			origin
		)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const razorpayCapture = async ({
	rpPaymentId,
	rpOrderId,
	storeId,
	origin,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`checkout/razorpay-capture`,
			{
				rpPaymentId,
				rpOrderId,
				store: storeId,
				domain: origin,
				return_url: `${origin}/payment/success`
			},
			origin
		)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const stripeCheckoutService = async ({
	paymentMethodId,
	address,
	storeId,
	origin,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`checkout/stripe`,
			{
				paymentMethodId,
				address,
				store: storeId
			},
			origin
		)

		return res || {}
	} catch (e) {
		throw error(e.status, e)
	}
}

export const paypalCheckout = async ({
	paymentMethodId,
	address,
	storeId,
	origin,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`checkout/paypal`,
			{
				paymentMethodId,
				address,
				store: storeId
			},
			origin
		)

		return res || {}
	} catch (e) {
		throw error(e.status, e)
	}
}
