import type { Error } from '$lib/types'
import { getMedusajsApi, postMedusajsApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
import { mapMedusajsCart } from './medusa-utils'
import { REGION_ID } from '.'

export const fetchCartData = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`cart`, {}, sid)

		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchRefreshCart = async ({
	origin,
	storeId,
	cookies,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		const cart_id = cookies.get('cartId')
		if (!cart_id || cart_id == 'undefined') return []
		const cartRes = await getMedusajsApi(`carts/${cart_id}`, {}, sid)

		res = mapMedusajsCart(cartRes?.cart)

		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data?.message)
	}
}

export const fetchMyCart = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = {} // await getMedusajsApi(`cart/me`, {}, sid)

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
	cookies,
	sid = null
}: any) => {
	try {
		let cart_id = cookies.get('cartId')
		if (cart_id == 'undefined') cart_id = null

		const body = {
			variant_id: vid || pid,
			quantity: qty
		}
		let res: any = {}
		if (!cart_id) {
			const cartRes = await postMedusajsApi(`carts`, { region_id: REGION_ID }, sid)
			cart_id = cartRes.cart?.id
		}
		const res_data = await postMedusajsApi(`carts/${cart_id}/line-items`, body, sid)

		res = mapMedusajsCart(res_data?.cart)

		return res || {}
	} catch (e) {
		// console.error(e)
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

		res = await getMedusajsApi(`cart/me`, {}, sid)

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

		res = await getMedusajsApi(`cart/me`, {}, sid)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
