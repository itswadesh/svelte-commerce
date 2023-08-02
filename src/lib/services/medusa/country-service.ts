import { getMedusajsApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export const fetchCountries = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		const cres = await getMedusajsApi(`regions`, {}, sid)
		res = cres.regions[0].countries
		return res || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchStates = async ({
	origin,
	storeId,
	countryCode,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`regions`, {}, sid)

		return res?.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
