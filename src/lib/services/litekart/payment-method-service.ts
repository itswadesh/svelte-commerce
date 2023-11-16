import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
const isServer = import.meta.env.SSR

export const fetchPaymentMethods = async ({ origin = null, storeId, sid = null }) => {
	try {
		let res = {}

		if (isServer) {
			res = await getBySid(`payment-methods?store=${storeId}`, sid)
		} else {
			res = await getAPI(`payment-methods?store=${storeId}`, origin)
		}
		return res?.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
