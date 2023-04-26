import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
const isServer = import.meta.env.SSR

export const fetchVendor = async ({ origin, slug, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`vendors/${slug}?store=${storeId}`, sid)
		} else {
			res = await getAPI(`vendors/${slug}?store=${storeId}`, origin)
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

		if (isServer) {
			res = await getBySid(`es/products?vendors=${slug}&page=${page}&store=${storeId}`, sid)
		} else {
			res = await getAPI(`es/products?vendors=${slug}&page=${page}&store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
