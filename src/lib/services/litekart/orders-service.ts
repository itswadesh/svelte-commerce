import { error } from '@sveltejs/kit'
import { getAPI, post } from '$lib/utils/api'
import { getBySid, postBySid } from '$lib/utils/server'

const isServer = import.meta.env.SSR

export const fetchOrders = async ({ isCors = false, origin = null, sid = null, storeId }) => {
	try {
		let res = {}

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
			pageSize: res.pageSize
		}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchOrder = async ({ origin = null, sid = null, storeId, id }) => {
	try {
		let res = {}

		if (isServer) {
			res = await getBySid(`orders/${id}?store=${storeId}`, sid)
		} else {
			res = await getAPI(`orders/${id}?store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchTrackOrder = async ({ id, origin, sid = null, storeId }) => {
	try {
		let res = {}

		if (isServer) {
			res = await getBySid(`order-tracking/${id}?store=${storeId}`, sid)
		} else {
			res = await getAPI(`order-tracking/${id}?store=${storeId}`, origin)
		}

		return res || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const getOrder = async ({ orderNo, cartId, origin, sid = null, storeId }) => {
	try {
		let res = {}
		if (isServer) {
			res = await getBySid(
				`orders-public?order_no=${orderNo}&store=${storeId}&cart_id=${cartId}`,
				sid
			)
		} else {
			res = await getAPI(
				`orders-public?order_no=${orderNo}&store=${storeId}&cart_id=${cartId}`,
				origin
			)
		}
		return res || {}
	} catch (e) {
		error(e?.status, e.data?.message || e?.message)
	}
}

export const paySuccessPageHit = async ({
	orderId,
	paymentMode,
	paymentReferenceId,
	status,
	origin,
	sid = null,
	storeId
}) => {
	try {
		let res = {}

		if (isServer) {
			res = await postBySid(
				`orders/pay-success-page-hit`,
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
				`orders/pay-success-page-hit`,
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
		error(e?.status, e.data?.message || e?.message)
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
	storeId
}) => {
	try {
		let res = {}

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
		error(e.status, e.data?.message || e.message)
	}
}

export const phonepeCheckout = async ({
	address,
	origin,
	orderNo,
	prescription = '',
	storeId,
	cartId
}) => {
	try {
		let res = {}

		res = await post(
			`checkout/phonepe`,
			{
				address,
				cart_id: cartId,
				domain: origin,
				order_no: orderNo,
				prescription,
				return_url: `${origin}/payment/success`,
				store: storeId
			},
			origin
		)

		return res || {}
	} catch (e) {
		error(e.status, e.message?.message || e.message)
	}
}
export const cashfreeCheckout = async ({
	address,
	orderNo,
	prescription = '',
	origin,
	cartId,
	storeId
}) => {
	try {
		let res = {}

		res = await post(
			`checkout/cashfree`,
			{
				address,
				cart_id: cartId,
				domain: origin,
				order_no: orderNo,
				prescription,
				return_url: `${origin}/payment/process-cf`,
				store: storeId
			},
			origin
		)
		return res || {}
	} catch (e) {
		error(e.status, e.message?.message || e.message)
	}
}

export const cashfreeCapture = async ({ order_no, origin, sid, storeId }) => {
	try {
		let res = {}

		res = await postBySid(
			`checkout/cashfree-capture`,
			{
				domain: origin,
				order_no,
				store: storeId
			},
			sid
		)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const razorpayCheckout = async ({
	address,
	orderNo,
	cartId,
	prescription = '',
	origin,
	storeId
}) => {
	try {
		let res = {}

		res = await post(
			`checkout/razorpay`,
			{
				address,
				cart_id: cartId,
				domain: origin,
				order_no: orderNo,
				prescription,
				return_url: `${origin}/payment/process`,
				store: storeId,
				paymentMethod: 'Razorpay'
			},
			origin
		)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const razorpayCapture = async ({ rpOrderId, rpPaymentId, origin, storeId }) => {
	try {
		let res = {}

		res = await post(
			`checkout/razorpay-capture`,
			{
				domain: origin,
				return_url: `${origin}/payment/process`,
				rpOrderId,
				rpPaymentId,
				store: storeId
			},
			origin
		)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const stripeCheckoutService = async ({
	address,
	paymentMethodId,
	origin,
	cartId,
	sid = null,
	storeId
}) => {
	try {
		let res = {}

		res = await post(
			`checkout/stripe`,
			{
				address,
				paymentMethodId,
				cart_id: cartId,
				store: storeId
			},
			origin
		)
		return res || {}
	} catch (e) {
		error(e.status, e)
	}
}

export const paypalCheckout = async ({ address, orderNo, cartId, origin, storeId }) => {
	try {
		let res = {}

		res = await post(
			`checkout/paypal`,
			{
				address,
				cart_id: cartId,
				domain: origin,
				order_no: orderNo,
				return_url: `${origin}/payment/process`,
				store: storeId,
				paymentMethod: 'Paypal'
			},
			origin
		)

		return res || {}
	} catch (e) {
		error(e.status, e)
	}
}
