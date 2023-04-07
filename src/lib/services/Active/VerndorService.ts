import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export const fetchVendor = async ({ origin, slug, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await getBySid(`vendors/${slug}`, sid)
		} else {
			res = await getAPI(`vendors/${slug}`, origin)
		}

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchProductsOfVendor = async ({
	slug,
	origin,
	page,
	server = false,
	sid = null,
	storeId
}: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await getBySid(`es/products?vendors=${slug}&page=${page}&store=${storeId}`, sid)
		} else {
			res = await getAPI(`es/products?vendors=${slug}&page=${page}&store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
