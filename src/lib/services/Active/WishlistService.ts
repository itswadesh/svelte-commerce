import { getAPI, post } from '$lib/utils/api'
import { getBySid, postBySid } from '$lib/utils/server'
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

		if (server) {
			res = await getBySid(
				`wishlists/my?search=${search || ''}&sort=${sort}&page=${currentPage}&store=${storeId}`,
				sid
			)
		} else {
			res = await getAPI(
				`wishlists/my?search=${search || ''}&sort=${sort}&page=${currentPage}&store=${storeId}`,
				origin
			)
		}

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

		if (server) {
			res = await getBySid(`wishlists/check?product=${pid}&variant=${vid}&store=${storeId}`, sid)
		} else {
			res = await getAPI(`wishlists/check?product=${pid}&variant=${vid}&store=${storeId}`, origin)
		}

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

		if (server) {
			res = await postBySid(`wishlists/toggle`, { product: pid, variant: vid, store: storeId }, sid)
		} else {
			res = await post(`wishlists/toggle`, { product: pid, variant: vid, store: storeId }, origin)
		}

		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
