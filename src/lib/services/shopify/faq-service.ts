import { error } from '@sveltejs/kit'
import { getShopifyApi } from '$lib/utils/server'

export const fetchFaqs = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getShopifyApi(`customers/me`, {}, sid)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
