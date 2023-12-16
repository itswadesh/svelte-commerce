import { getShopifyApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchBlogs = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getShopifyApi(`customers/me`, {}, sid)

		return res.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchLatestBlogs = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getShopifyApi(`customers/me`, {}, sid)

		return res.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchBlog = async ({ origin, id, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getShopifyApi(`customers/me`, {}, sid)

		return res.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
