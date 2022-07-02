import { del, getAPI, post } from '$lib/utils/api'
import { error } from '@sveltejs/kit'
import { getBySid, postt } from '$lib/utils/server'
import type { Error } from '$lib/types'
const isServer = import.meta.env.SSR

export const fetchCartData = async ({ origin, storeId, server = false, sid = null }) => {
	try {
		let res = {}

		if (isServer) {
			res = await getBySid(`cart?store=${storeId}`, sid)
		} else {
			res = await getAPI(`cart?store=${storeId}`, origin)
		}

		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchRefreshCart = async ({ origin = null, storeId, isCors = false, server = false, sid = null }) => {
	try {
		let res = {}
		if (isServer || isCors) {
			res = await getBySid(`carts/refresh-cart?store=${storeId}`, sid)
			// res = await getBySid(`carts/my?store=${storeId}`, sid)
		} else {
			res = await getAPI(`carts/refresh-cart?store=${storeId}`, origin)
		}
		return res || {}
	} catch (err) {
		return {}
		// const e = err as Error
		// throw error(e.status, e.data?.message)
	}
}
export const fetchMyCart = async ({ origin, storeId, server = false, sid = null }) => {
	try {
		let res = {}

		if (isServer) {
			res = await getBySid(`carts/my?store=${storeId}`, sid)
		} else {
			res = await getAPI(`carts/my?store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const addToCartService = async ({
	cookies,
	customizedData = null,
	customizedImg = null,
	options = null,
	origin,
	pid,
	qty,
	server = false,
	sid = null,
	storeId,
	vid,
}) => {
	try {
		let res = {}
		if (isServer) {
			res = await postt(
				`carts/add-to-cart`,
				{
					customizedData,
					customizedImg,
					options,
					pid,
					qty,
					store: storeId,
					vid,
				},
				cookies
			)
		} else {
			res = await post(
				`carts/add-to-cart`,
				{
					pid,
					vid,
					qty,
					customizedImg,
					store: storeId,
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
