import { error } from '@sveltejs/kit'
import { getAPI, post } from '$lib/utils/api'
import { getBySid, postBySid } from '$lib/utils/server'
import type { AllOrders, Error } from '$lib/types'

const isServer = import.meta.env.SSR

export const fetchOrders = async ({
	isCors = false,
	origin,
	sid = null,
	storeId
}: any) => {
	try {
		let res: AllOrders | {} = {}

		if (isServer || isCors) {
			res = await getBySid(`orders/my?store=${storeId}&active=true`, sid)
		} else {
			res = await getAPI(`orders/my?store=${storeId}&active=true`, origin)
		}

		return {
			count: res.count,
			data: res.data || [],
			noOfPage: res.noOfPage,
			page: res.page,
			pageSize: res.pageSize,
		}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchOrder = async ({
	origin,
	sid = null,
	storeId, id,
}: any) => {
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

export const fetchTrackOrder = async ({
	id,
	origin,
	sid = null,
	storeId,
}: any) => {
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
	orderId,
	paymentMode,
	paymentReferenceId,
	status,
	origin,
	sid = null,
	storeId,
}: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await postBySid(
				`orders/pay-sucess-page-hit`,
				{
					orderId,
					paymentMode,
					paymentReferenceId,
					status,
					store: storeId
				},
				sid
			)
		} else {
			res = await post(
				`orders/pay-sucess-page-hit`,
				{
					orderId,
					paymentMode,
					status,
					store: storeId
				},
				origin
			)
		}

		return res || {}
	} catch (e) {
		throw error(e?.status, e.data?.message || e?.message)
	}
}

export const codCheckout = async ({
	address,
	cartId,
	comment = '',
	paymentMethod,
	prescription,
	origin,
	sid = null,
	storeId,
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`orders/checkout/cod?cart_id=${cartId}`,
			{
				address,
				cart_id: cartId,
				comment,
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

export const phonepeCheckout = async ({
	address,
	origin,
	prescription,
	sid = null,
	storeId,
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`checkout/phonepe`,
			{
				address,
				domain: origin,
				prescription,
				return_url: `${origin}/payment/success`,
				store: storeId,
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
	origin,
	sid = null,
	storeId,
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`checkout/cashfree`,
			{
				address,
				domain: origin,
				prescription,
				return_url: `${origin}/payment/process-cf`,
				store: storeId,
			},
			origin
		)
		return res || {}
	} catch (e) {
		// console.log(e);

		throw error(e.status, e.message?.message || e.message)
	}
}

export const cashfreeCapture = async ({
	order_no,
	origin,
	sid,
	storeId,
}: any) => {
	try {
		let res: any = {}

		res = await postBySid(
			`checkout/cashfree-capture`,
			{
				domain: origin,
				order_no,
				store: storeId,
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
	cartId,
	paymentMethod,
	prescription,
	origin,
	sid = null,
	storeId,
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`checkout/razorpay?cart_id=${cartId}`,
			{
				address,
				cart_id: cartId,
				domain: origin,
				paymentMethod,
				prescription,
				return_url: `${origin}/payment/process`,
				store: storeId,
			},
			origin
		)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const razorpayCapture = async ({
	rpOrderId,
	rpPaymentId,
	origin,
	sid = null,
	storeId,
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`checkout/razorpay-capture`,
			{
				domain: origin,
				return_url: `${origin}/payment/process`,
				rpOrderId,
				rpPaymentId,
				store: storeId,
			},
			origin
		)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const stripeCheckoutService = async ({
	address,
	paymentMethodId,
	origin,
	sid = null,
	storeId,
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`checkout/stripe`,
			{
				address,
				paymentMethodId,
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
	address,
	paymentMethodId,
	origin,
	sid = null,
	storeId,
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`checkout/paypal`,
			{
				address,
				paymentMethodId,
				store: storeId
			},
			origin
		)

		return res || {}
	} catch (e) {
		throw error(e.status, e)
	}
}
