import { getBigcommerceApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export const fetchDeals = async ({ origin, query, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
	
				res = await getBigcommerceApi(`products`, {}, sid)
				
		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
