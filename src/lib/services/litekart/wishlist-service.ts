import { error } from '@sveltejs/kit'
import { getAPI, post } from '$lib/utils/api'
import { getBySid, postBySid } from '$lib/utils/server'
const isServer = import.meta.env.SSR

export const moveUnavailableItemsToWishlist = async ({ origin, storeId, sid = null }) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await postBySid(
				`wishlists/move-unavailable-items-to-wishlist?store=${storeId}`,
				{ store: storeId },
				sid
			)
		} else {
			res = await post(
				`wishlists/move-unavailable-items-to-wishlist?store=${storeId}`,
				{ store: storeId },
				origin
			)
		}

		return res || {}
	} catch (e) {
		// console.log('error at move unavailable items to wishlist', e)
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchWishlist = async ({
	origin,
	storeId,
	search = null,
	sort = '-createdAt',
	currentPage = 1,
	server = false,
	sid = null
}) => {
	try {
		let res: any = {}

		if (isServer && sid != null) {
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
		error(e.status, e.data?.message || e.message)
	}
}

export const checkWishlist = async ({
	origin,
	storeId,
	pid,
	vid,
	isCors = false,
	server = false,
	sid = null
}) => {
	// if (!sid) return false

	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`wishlists/check?product=${pid}&variant=${vid}&store=${storeId}`, sid)
		} else {
			res = await getAPI(`wishlists/check?product=${pid}&variant=${vid}&store=${storeId}`, origin)
		}

		return res
	} catch (e) {
		return false
	}
}

export const toggleWishlistService = async ({
	storeId,
	pid,
	vid,
	origin,
	isCors = false,
	sid = null
}) => {
	try {
		let res: any = {}

		if (isServer || isCors) {
			res = await postBySid(`wishlists/toggle`, { product: pid, variant: vid, store: storeId }, sid)
		} else {
			res = await post(`wishlists/toggle`, { product: pid, variant: vid, store: storeId }, origin)
		}

		return res
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
