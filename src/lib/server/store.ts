import { StoreService } from '$lib/services'
import type { RequestEvent } from '@sveltejs/kit'
export const fetchStoreData = async (event: RequestEvent) => {
	try {
		const cookieStore = event.cookies.get('store')
		const zip = event.cookies.get('zip')
		if (zip) {
			event.locals.zip = JSON.parse(zip)
		}
		const r = await StoreService.getStoreData({
			url: event.request.url,
			cookies: event.cookies,
			cookieStore,
			server: true
		})
		return r?.storeOne || {}
	} catch (e) {
		return null
	}
}
