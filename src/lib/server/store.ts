import { CategoryService, StoreService } from '$lib/services'
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
		r.megamenu1 = await CategoryService.fetchMegamenuData({
			origin: event.request.url,
			storeId: r.storeOne.id,
			sid: event.cookies.get('connect.sid'),
			server: true
		})
		return r || {}
	} catch (e) {
		return {}
	}
}
