import type { Error } from '$lib/types'
import { getMedusajsApi, postMedusajsApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
import { mapMedusajsCart } from './medusa-utils'

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

		const id = cookies.get('cartId')

		const cartRes = await getMedusajsApi(`carts/${id}`, {}, sid)

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

		res = await getMedusajsApi(`cart/me`, {}, sid)

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
		const var_id = await getMedusajsApi(`products/${pid}`, sid)

		const body = {
			variant_id: var_id.product?.variants[0]?.id,
			quantity: qty
		}

		let res: any = {}

		const cartRes = await postMedusajsApi(`carts`, sid)

		const res_data = await postMedusajsApi(`carts/${cartRes.cart?.id}/line-items`, body, sid)

		res = mapMedusajsCart(res_data?.cart)

		return res || {}
	} catch (e) {
		console.error(e)
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
