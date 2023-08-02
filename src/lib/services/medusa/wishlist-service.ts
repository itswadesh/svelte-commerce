import { getMedusajsApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchWishlist = async ({
	origin,
	storeId,
	search,
	sort,
	currentPage,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = {} // await getMedusajsApi(`wishlists/me`, {}, sid)

		return res?.data || []
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const checkWishlist = async ({
	origin,
	storeId,
	pid,
	vid,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = false // await getMedusajsApi(`wishlists/me`, {}, sid)

		return res
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const toggleWishlistService = async ({
	storeId,
	pid,
	vid,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = null // await getMedusajsApi(`wishlists/me`, {}, sid)

		return res
	} catch (e) {
		throw error(e.status, e.message)
	}
}
