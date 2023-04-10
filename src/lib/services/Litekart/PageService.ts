import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'

export const fetchPage = async ({ origin, pageId, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		if (server) {
			res = await getBySid(`pages/${pageId}?store=${storeId}`, sid)
		} else {
			res = await getAPI(`pages/${pageId}?store=${storeId}`, origin)
		}

		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
