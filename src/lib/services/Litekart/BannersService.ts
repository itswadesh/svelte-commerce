import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export const fetchBanners = async ({
	origin,
	pageId,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await getBySid(`banners?pageId=${pageId}&store=${storeId}&active=true`, sid)
		} else {
			res = await getAPI(`banners?pageId=${pageId}&store=${storeId}&active=true`, origin)
		}

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchBannersGroup = async ({
	origin,
	storeId,
	pageId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await getBySid(`banners?pageId=${pageId}&store=${storeId}&active=true`, sid)
		} else {
			res = await getAPI(`banners?pageId=${pageId}&store=${storeId}&active=true`, origin)
		}

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
