import { error } from '@sveltejs/kit'
import { getBigcommerceApi } from '$lib/utils/server'

export const fetchInit = async (host) => {
	// This is called once during hard reload + everytime footer is hit through /server/store/server.ts
	const isServer = import.meta.env.SSR
	if (!isServer) return {}
	try {
		let res: any = {}
		// DOMAIN value is proviede in case of self hosted and host value in case of SaaS
		res = await getBigcommerceApi(`init`)
		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
