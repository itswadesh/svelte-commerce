import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
const isServer = import.meta.env.SSR

export const fetchProductCheckDiscount = async ({ origin, pid, storeId, sid = null }: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`products/check-discount/${pid}?store=${storeId}`, sid)
		} else {
			res = await getAPI(`products/check-discount/${pid}?store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
