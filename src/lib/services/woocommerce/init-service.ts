import { error } from '@sveltejs/kit'
import { DOMAIN } from '$lib/config'

export const fetchInit = async (host) => {
	// This is called once during hard reload + everytime footer is hit through /server/store/server.ts
	try {
		let res: any = {}
		// DOMAIN value is proviede in case of self hosted and host value in case of SaaS
		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
