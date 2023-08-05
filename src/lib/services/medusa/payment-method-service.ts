import { getMedusajsApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchPaymentMethods = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		const cres = await getMedusajsApi(`regions`, {}, sid)
		res = cres.regions[0].payment_providers
		return res || []
	} catch (e) {
		throw error(e.status, e.message)
	}
}
