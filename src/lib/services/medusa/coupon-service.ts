import { getMedusajsApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchCoupons = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = [] // await getMedusajsApi(`coupons`, {}, sid)

		return res?.data || []
	} catch (e) {
		throw error(e.status, e.message)
	}
}
