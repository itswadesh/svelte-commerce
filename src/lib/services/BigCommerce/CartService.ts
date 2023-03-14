import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { del, getAPI, post } from '$lib/utils/api'
import { getBySid, getBigcommerceApi, getWoocommerceApi, postBySid, postt } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchCartData = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getBigcommerceApi(`customers/me`, {}, sid)

		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchRefreshCart = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getBigcommerceApi(`customers/me`, {}, sid)

		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data?.message)
	}
}

export const fetchMyCart = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getBigcommerceApi(`customers/me`, {}, sid)

		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data?.message)
	}
}

export const addToCartService = async ({
	pid,
	vid,
	qty,
	customizedImg,
	origin,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getBigcommerceApi(`customers/me`, {}, sid)

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

		res = await getBigcommerceApi(`customers/me`, {}, sid)

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

		res = await getBigcommerceApi(`customers/me`, {}, sid)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
