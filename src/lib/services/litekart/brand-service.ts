import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
const isServer = import.meta.env.SSR

export const fetchBrands = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`brands?store=${storeId}`, sid)
		} else {
			res = await getAPI(`brands?store=${storeId}`, origin)
		}

		return res.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
