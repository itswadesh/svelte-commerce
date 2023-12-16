import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'

const isServer = import.meta.env.SSR

export const fetchVendors = async ({ origin, storeId, server = false, sid = null }) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`vendors?store=${storeId}`, sid)
		} else {
			res = await getAPI(`vendors?store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchVendor = async ({ origin, slug, storeId, server = false, sid = null }) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`vendors/${slug}?store=${storeId}`, sid)
		} else {
			res = await getAPI(`vendors/${slug}?store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchProductsOfVendor = async ({ slug, origin, page, sid = null, storeId }) => {
	try {
		let res = {}

		if (isServer) {
			res = await getBySid(`es/products?vendors=${slug}&page=${page}&store=${storeId}`, sid)
		} else {
			res = await getAPI(`es/products?vendors=${slug}&page=${page}&store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
