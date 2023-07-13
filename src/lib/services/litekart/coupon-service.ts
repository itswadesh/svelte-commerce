import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
const isServer = import.meta.env.SSR

export const fetchCoupons = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`coupons?store=${storeId}`, sid)
		} else {
			res = await getAPI(`coupons?store=${storeId}`, origin)
		}

		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
