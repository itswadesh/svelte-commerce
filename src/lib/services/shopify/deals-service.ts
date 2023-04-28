import { getShopifyApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchDeals = async ({ origin, query, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getShopifyApi(`products`, {}, sid)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
