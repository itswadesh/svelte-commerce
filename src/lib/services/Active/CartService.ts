import { del, getAPI, post } from '$lib/utils/api'
import { error } from '@sveltejs/kit'
import { getBySid, postt } from '$lib/utils/server'
import type { Error } from '$lib/types'

export const fetchCartData = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (server) {
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

export const fetchRefreshCart = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await getBySid(`carts/refresh-cart?store=${storeId}`, sid)
			// res = await getBySid(`carts/my?store=${storeId}`, sid)
		} else {
			res = await getAPI(`carts/refresh-cart?store=${storeId}`, origin)
		}

		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data?.message)
	}
}
export const fetchMyCart = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await getBySid(`carts/my?store=${storeId}`, sid)
			// res = await getBySid(`carts/my?store=${storeId}`, sid)
		} else {
			res = await getAPI(`carts/my?store=${storeId}`, origin)
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
	customizedImg,
	customizedData,
	origin,
	options,
	storeId,
	server = false,
	cookies = null
}: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await postt(
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

export const applyCouponService = async ({
	code,
	origin,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

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
}: any) => {
	try {
		let res: any = {}

		res = await del(`coupon/remove?code=${code}&store=${storeId}`, origin)


		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
