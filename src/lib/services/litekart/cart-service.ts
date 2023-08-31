import { del, getAPI, post } from '$lib/utils/api'
import { error } from '@sveltejs/kit'
import { getBySid, postBySid } from '$lib/utils/server'
import type { Error } from '$lib/types'
const isServer = import.meta.env.SSR

export const fetchCartData = async ({ origin, storeId, cartId = null, sid = null }) => {
	try {
		let res = {}

		if (isServer) {
			res = await getBySid(`cart?store=${storeId}&cart_id=${cartId}`, sid)
		} else {
			res = await getAPI(`cart?store=${storeId}&cart_id=${cartId}`, origin)
		}

		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchRefreshCart = async ({ origin = null, storeId, isCors = false, cartId, sid = null }) => {
	try {
		let res = {}

		if (isServer || isCors) {
			res = await getBySid(`carts/refresh-cart?store=${storeId}&cart_id=${cartId}`, sid)
			// res = await getBySid(`carts/my?store=${storeId}`, sid)
		} else {
			res = await getAPI(`carts/refresh-cart?store=${storeId}&cart_id=${cartId}`, origin)
		}
		return res || {}
	} catch (err) {
		return {}
		// const e = err as Error
		// throw error(e.status, e.data?.message)
	}
}

export const fetchMyCart = async ({ origin, storeId, cartId = null, sid = null }) => {
	try {
		let res = {}

		if (isServer) {
			res = await getBySid(`carts/my?store=${storeId}&cart_id=${cartId}`, sid)
		} else {
			res = await getAPI(`carts/my?store=${storeId}&cart_id=${cartId}`, origin)
		}

		return res || {}
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const addToCartService = async ({
	pid,
	vid,
	qty,
	customizedImg = null,
	customizedData = null,
	origin = null,
	options = null,
	storeId,
	cartId,
	sid = null
}) => {
	try {
		let res = {}
		if (isServer) {
			res = await postBySid(
				`carts/add-to-cart?store=${storeId}&cart_id=${cartId}`,
				{
					pid,
					vid,
					qty,
					customizedImg,
					store: storeId,
					cart_id: cartId,
					customizedData,
					options
				},
				sid
			)
		} else {
			res = await post(
				`carts/add-to-cart?store=${storeId}&cart_id=${cartId}`,
				{
					pid,
					vid,
					qty,
					customizedImg,
					store: storeId,
					cart_id: cartId,
					customizedData,
					options
				},
				origin
			)
		}

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const applyCouponService = async ({ code, origin, storeId, server = false, sid = null }) => {
	try {
		let res = {}

		res = await post(
			`coupons/apply`,
			{
				code,
				store: storeId
			},
			origin
		)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const removeCouponService = async ({
	code,
	origin,
	storeId,
	server = false,
	sid = null
}) => {
	try {
		let res = {}

		res = await del(`coupons/remove?code=${code}&store=${storeId}`, origin)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const updateCart = async ({ billingAddress, cartId = '', email = '', shippingAddress, origin = null, storeId }) => {
	try {
		const addressId = shippingAddress?._id || shippingAddress?.id

		return addressId
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}