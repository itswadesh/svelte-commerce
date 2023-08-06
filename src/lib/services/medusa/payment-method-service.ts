import { getMedusajsApi, postMedusajsApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export const fetchPaymentMethods = async ({ origin, storeId, cartId, sid = null }: any) => {
	try {
		let res: any = {}
		try {
			await postMedusajsApi(`carts/${cartId}/payment-sessions`, {}, sid)
		} catch (e) {}
		const cres = await getMedusajsApi(`regions`, {}, sid)
		res = cres.regions[0].payment_providers
		return res || []
	} catch (e) {
		throw error(e.status, e.message)
	}
}
