import { getBigcommerceApi } from '$lib/utils/server'
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

		res = await getBigcommerceApi(`customers/me`, {}, sid)

		return res?.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const checkhWishlist = async ({
	origin,
	storeId,
	pid,
	vid,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getBigcommerceApi(`customers/me`, {}, sid)

		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
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

		res = await getBigcommerceApi(`customers/me`, {}, sid)

		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
