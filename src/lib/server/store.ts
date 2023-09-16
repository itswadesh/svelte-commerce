import { CategoryService, StoreService } from '$lib/services'
import type { RequestEvent } from '@sveltejs/kit'

export const fetchStoreData = async (event: RequestEvent) => {
	try {
		const cookieMegamenu = event.cookies.get('megamenu')
		const cookieStore = event.cookies.get('store')
		const zip = event.cookies.get('zip')

		if (zip) {
			event.locals.zip = JSON.parse(zip)
		}

		const r = await StoreService.getStoreData({
			url: event.request.url,
			cookies: event.cookies,
			cookieStore,
			cookieMegamenu,
			server: true
		})

		if (!cookieMegamenu || cookieMegamenu == 'undefined') {
			r.megamenu1 = await CategoryService.fetchMegamenuData({
				origin: event.request.url,
				storeId: r.storeOne.id,
				sid: event.cookies.get('connect.sid'),
				megamenu: true
			})
		} else {
			r.megamenu1 = JSON.parse(cookieMegamenu)
		}

		return r || {}
	} catch (e) {
		return {}
	}
}
