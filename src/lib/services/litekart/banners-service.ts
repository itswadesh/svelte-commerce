import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
const isServer = import.meta.env.SSR

export const fetchBanners = async ({
	origin,
	pageId,
	storeId,
	sid = null
}: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`banners?pageId=${pageId}&store=${storeId}&active=true`, sid)
		} else {
			res = await getAPI(`banners?pageId=${pageId}&store=${storeId}&active=true`, origin)
		}

		return res.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message);
	}
}

export const fetchBannersGroup = async ({
	origin,
	storeId,
	pageId,
	sid = null
}: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`banners?pageId=${pageId}&store=${storeId}&active=true`, sid)
		} else {
			res = await getAPI(`banners?pageId=${pageId}&store=${storeId}&active=true`, origin)
		}

		return res.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message);
	}
}
