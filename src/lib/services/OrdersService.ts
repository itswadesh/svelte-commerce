import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI, post } from '$lib/utils/api'
import {
	getBigCommerceApi,
	getBySid,
	getWooCommerceApi,
	postBigCommerceApi,
	postBySid,
	postWooCommerceApi
} from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchOrders = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`orders/my?store=${storeId}&active=true`, sid)
				} else {
					res = await getAPI(`orders/my?store=${storeId}&active=true`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`orders/my`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`orders/my`, {}, sid)
				break
		}
		return {
			data: res.data || [],
			count: res.count,
			pageSize: res.pageSize,
			noOfPage: res.noOfPage,
			page: res.page
		}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchOrder = async ({ origin, storeId, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`orders/${id}?store=${storeId}`, sid)
				} else {
					res = await getAPI(`orders/${id}?store=${storeId}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`orders/${id}`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`orders/${id}`, {}, sid)
				break
		}
		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchTrackOrder = async ({ origin, storeId, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`order-tracking?order=${id}&store=${storeId}`, sid)
				} else {
					res = await getAPI(`order-tracking?order=${id}&store=${storeId}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`order-tracking`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`order-tracking`, {}, sid)
				break
		}
		return res.data || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
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
		switch (provider) {
			case 'litekart':
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
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`orders/pay-sucess-page-hit`, {}, sid)
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`orders/pay-sucess-page-hit`, {}, sid)
				break
		}
		return res.data || []
	} catch (err) {
		const e = err as Error
		console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', e)
		throw error(e.status, e.data?.message)
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
		switch (provider) {
			case 'litekart':
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
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`orders/checkout/cod`, {}, sid)
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`orders/checkout/cod`, {}, sid)
				break
		}
		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
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
		switch (provider) {
			case 'litekart':
				res = await post(
					`payments/checkout-cf`,
					{
						address,
						paymentMethod,
						prescription,
						store: storeId,
						sid
					},
					origin
				)
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`payments/checkout-cf`, {}, sid)
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`payments/checkout-cf`, {}, sid)
				break
		}
		return res.data || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
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
		switch (provider) {
			case 'litekart':
				res = await post(
					`payments/checkout-rp`,
					{
						address,
						paymentMethod,
						prescription,
						store: storeId,
						sid
					},
					origin
				)
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`payments/checkout-rp`, {}, sid)
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`payments/checkout-rp`, {}, sid)
				break
		}
		return res.data || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
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
		switch (provider) {
			case 'litekart':
				res = await post(
					`payments/capture-rp`,
					{
						rpPaymentId,
						rpOrderId,
						store: storeId,
						sid
					},
					origin
				)
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`payments/capture-rp`, {}, sid)
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`payments/capture-rp`, {}, sid)
				break
		}
		return res.data || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
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
		switch (provider) {
			case 'litekart':
				res = await post(
					`stripe`,
					{
						paymentMethodId,
						address,
						store: storeId,
						sid
					},
					origin
				)
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`stripe`, {}, sid)
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`stripe`, {}, sid)
				break
		}
		return res.data || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}
