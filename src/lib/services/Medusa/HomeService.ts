import { error } from '@sveltejs/kit'
import { getMedusajsApi } from '$lib/utils/server'

export const fetchHome = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`products`, {}, sid)

		return res || {}
	} catch (e) {
		throw error(e.status || 404, e.data?.message || e.message)
	}
}
