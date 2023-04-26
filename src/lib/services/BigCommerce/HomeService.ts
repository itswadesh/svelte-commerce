import { error } from '@sveltejs/kit'
import { getBigcommerceApi } from '$lib/utils/server'

export const fetchHome = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getBigcommerceApi(`products`)

		return res || {}
	} catch (e) {
		throw error(e.status || 404, e.data?.message || e.message)
	}
}
