import { DOMAIN, HTTP_ENDPOINT } from '$lib/config'
import { error } from '@sveltejs/kit'

export const prerender = false
export const load = async ({ parent, data, fetch }) => {
	await parent()
	let locals = data
	try {
		const res2 = await fetch('/server/store')
		const storeFromServer = await res2.json()
		locals.storeId = storeFromServer.store?.id
		locals.store = storeFromServer.store
		locals.megamenu = storeFromServer.megamenu
		locals.menu = storeFromServer.menu
		locals.popularSearches = storeFromServer.popularSearches
		return { ...locals }
	} catch (e) {
		throw error(
			404,
			`Store Not Found @Layout 
			<br/>ID: ${locals.storeId}
			<br/>ORIGIN: ${locals.origin}
			<br/>DOMAIN(env): ${DOMAIN}
			<br/>HTTP_ENDPOINT(env): ${HTTP_ENDPOINT}`
		)
	}
}
