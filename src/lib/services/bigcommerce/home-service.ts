import { error } from '@sveltejs/kit'
import { getBigcommerceApi } from '$lib/utils/server'

export const fetchHome = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getBigcommerceApi(`products`, {}, sid)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
