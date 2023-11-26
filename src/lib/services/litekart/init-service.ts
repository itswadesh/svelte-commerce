import { DOMAIN } from '$lib/config'
import { getBySid, gett } from '$lib/utils/server'

export const fetchInit = async ({ host, origin = null }) => {
	// This is called once during hard reload + everytime footer is hit through /server/store/server.ts
	const isServer = import.meta.env.SSR

	try {
		let res = {}

		// DOMAIN value is proviede in case of self hosted and host value in case of SaaS
		if (!isServer) {
			res = await gett(`init?domain=${DOMAIN ? DOMAIN : host}`, origin)
		} else {
			res = await getBySid(`init?domain=${DOMAIN ? DOMAIN : host}`)
		}

		return res || { storeOne: {} }
	} catch (e) {
		throw { status: e.status, message: e.data?.message || e.message }
	}
}
