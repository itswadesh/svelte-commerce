import { DOMAIN, HTTP_ENDPOINT } from '$lib/config'
import { error } from '@sveltejs/kit'

export const prerender = false
export const load = async ({ parent, data, fetch, url }) => {
	await parent()
	try {
		const res2 = await fetch('/server/store')
		const storeFromServer = await res2.json()
		// locals.storeId = storeFromServer.store?.id
		data.store = storeFromServer.store
		// data.megamenu = storeFromServer.megamenu
		// data.menu = storeFromServer.menu
		// data.popularSearches = storeFromServer.popularSearches
		data.url = url.pathname
		return { ...data }
	} catch (e) {
		error(
			404,
			`Store Not Found @Layout 
			<br/>ID: ${data.storeId}
			<br/>ORIGIN: ${data.origin}
			<br/>DOMAIN(env): ${DOMAIN}
			<br/>HTTP_ENDPOINT(env): ${HTTP_ENDPOINT}`
		)
	}
}
