import { error } from '@sveltejs/kit'
import { getBySid } from '$lib/utils/server'
import { DOMAIN } from '$lib/config'

export const fetchInit = async (host) => {
	// This is called once during hard reload + everytime footer is hit through /server/store/server.ts
	const isServer = import.meta.env.SSR
	if (!isServer) return {}
	try {
		let res: any = {}
		// DOMAIN value is proviede in case of self hosted and host value in case of SaaS
		console.log('init..................', `init?domain=${DOMAIN ? DOMAIN : host}`)
		res = await getBySid(`init?domain=${DOMAIN ? DOMAIN : host}`)
		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
