import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
const isServer = import.meta.env.SSR

export const fetchCountries = async ({ origin, storeId, sid = null }: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`countries?limit=500&page=0&store=${storeId}`, sid)
		} else {
			res = await getAPI(`countries?limit=500&page=0&store=${storeId}`, origin)
		}

		return res?.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchStates = async ({ origin, storeId, countryCode, sid = null }: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(
				`states?countryCode=${countryCode}&limit=500&page=0&sort=name&store=${storeId}`,
				sid
			)
		} else {
			res = await getAPI(
				`states?countryCode=${countryCode}&limit=500&page=0&sort=name&store=${storeId}`,
				origin
			)
		}

		return res?.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
