import { json } from '@sveltejs/kit'
import { StoreService } from '$lib/services'
import { DOMAIN } from '$lib/config'

export async function GET({ cookies, request, locals, setHeaders }) {
	let store

	const host = locals.host
	const origin = locals.origin

	try {
		const storeRes = await StoreService.getStoreData({
			url: request.url,
			host: DOMAIN || host,
			origin,
			cookies
		})
		store = storeRes.storeOne

		setHeaders({ 'Cache-Control': 'max-age=300' })
	} catch (e) {}
	return json({ store })
}
