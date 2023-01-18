
import { getStoreData } from '$lib/services/StoreService'
import type { RequestEvent } from '@sveltejs/kit'
export const fetchStoreData = async (event: RequestEvent) => {
	try {
		const cookieStore = event.cookies.get('store')
		const zip = event.cookies.get('zip')
		if (zip) {
			event.locals.zip = JSON.parse(zip)
		}
		getStoreData({url:event.request.url,cookies:event.cookies,cookieStore})
	} catch (e) {
		return null
	}
}
