import { del, getAPI, post } from '$lib/utils/api'
import { error } from '@sveltejs/kit'
import { getBySid, postBySid } from '$lib/utils/server'
import type { Error } from '$lib/types'
const isServer = import.meta.env.SSR

export const fetchCartData = async ({
	cartId = null,
	origin,
	sid = null,
	storeId,
}) => {
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

export const fetchRefreshCart = async ({
	cartId,
	isCors = false,
	origin = null,
	sid = null,
	storeId,
}) => {
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

export const fetchMyCart = async ({
	cartId = null,
	origin,
	sid = null,
	storeId,
}) => {
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
	cartId,
	customizedData = null,
	customizedImg = null,
	options = null,
	pid,
	qty,
	vid,
	origin = null,
	sid = null,
	storeId,
}) => {
	try {
		let res = {}
		if (isServer) {
			res = await postBySid(
				`carts/add-to-cart?store=${storeId}&cart_id=${cartId}`,
				{
					cart_id: cartId,
					customizedData,
					customizedImg,
					options,
					pid,
					qty,
					vid,
					store: storeId,
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

export const createBackOrder = async ({
	pid,
	qty,
	origin = null,
	sid = null,
	storeId,
}) => {
	try {
		let res = {}
		if (isServer) {
			res = await postBySid(
				`backorder`,
				{
					pid,
					qty,
					store: storeId,
				},
				sid
			)
		} else {
			res = await post(
				`backorder`,
				{
					id: 'new',
					pid,
					qty,
					store: storeId,
				},
				origin
			)
		}

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const applyCouponService = async ({
	cartId,
	code,
	origin,
	server = false,
	sid = null,
	storeId,
}) => {
	try {
		let res = {}

		res = await post(
			`coupons/apply?cart_id=${cartId}`,
			{
				cart_id: cartId,
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
	cartId,
	code,
	origin,
	server = false,
	sid = null,
	storeId,
}) => {
	try {
		let res = {}

		res = await del(`coupons/remove?code=${code}&store=${storeId}&cart_id=${cartId}`, origin)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const updateCart = async ({
	billingAddress,
	cartId = '',
	email = '',
	origin = null,
	shippingAddress,
	storeId
}) => {
	try {
		const addressId = shippingAddress?._id || shippingAddress?.id

		return addressId
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}