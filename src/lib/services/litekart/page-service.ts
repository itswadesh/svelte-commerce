import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
const isServer = import.meta.env.SSR

export const fetchPages = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`pages?store=${storeId}`, sid)
		} else {
			res = await getAPI(`pages?store=${storeId}`, origin)
		}

		return res.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchLatestPages = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`pages?sort=-updatedAt&limit=10&store=${storeId}`, sid)
		} else {
			res = await getAPI(`pages?sort=-updatedAt&limit=10&store=${storeId}`, origin)
		}

		return res.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchPage = async ({ origin, id, slug, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`pages/${id || slug}?store=${storeId}`, sid)
		} else {
			res = await getAPI(`pages/${id || slug}?store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
