import type { Error } from '$lib/types'
import { getShopifyApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'
import { shopifyInit } from 'lib/utils'

export const fetchCartData = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await shopifyInit({
			query: `{
				products(first: 10) {
					edges {
						node {
							id
							title
							tags
						}
					}
				}
			}
			`,
			variables: {}
		})

		// console.log('res', res);

		return res || {}
	} catch (err) {
		const e = err as Error
		error(e.status, e.data.message)
	}
}

export const fetchRefreshCart = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await shopifyInit({
			query: `{
				products(first: 10) {
					edges {
						node {
							id
							title
							tags
						}
					}
				}
			}
			`,
			variables: {}
		})
		return res || {}
	} catch (e) {
		error(e.status, e.message)
	}
}

export const fetchMyCart = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getShopifyApi(`customers/me`, {}, sid)

		return res || {}
	} catch (e) {
		error(e.status, e.message)
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

		res = await getShopifyApi(`customers/me`, {}, sid)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
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

		res = await getShopifyApi(`customers/me`, {}, sid)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
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

		res = await getShopifyApi(`customers/me`, {}, sid)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
