import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
const isServer = import.meta.env.SSR

export const fetchPaymentMethods = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`payment-methods?store=${storeId}&active=true`, sid)
		} else {
			res = await getAPI(`payment-methods?store=${storeId}&active=true`, origin)
		}

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
