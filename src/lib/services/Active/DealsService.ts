import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export const fetchDeals = async ({ origin, query, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await getBySid(`deals?store=${storeId}`, sid)
		} else {
			res = await getAPI(`deals?store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
