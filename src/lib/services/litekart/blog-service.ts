import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
const isServer = import.meta.env.SSR

export const fetchBlogs = async ({ origin = null, storeId, sid = null }) => {
	try {
		let res = {}

		if (isServer) {
			res = await getBySid(`blogs?store=${storeId}`, sid)
		} else {
			res = await getAPI(`blogs?store=${storeId}`, origin)
		}
		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message);
	}
}

export const fetchLatestBlogs = async ({ origin = null, storeId, sid = null }) => {
	try {
		let res = {}

		if (isServer) {
			res = await getBySid(`blogs?sort=-updatedAt&limit=10&store=${storeId}`, sid)
		} else {
			res = await getAPI(`blogs?sort=-updatedAt&limit=10&store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message);
	}
}

export const fetchBlog = async ({ origin = null, id, storeId, sid = null }) => {
	try {
		let res = {}

		if (isServer) {
			res = await getBySid(`blogs/${id}?store=${storeId}`, sid)
		} else {
			res = await getAPI(`blogs/${id}?store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message);
	}
}
