import { DOMAIN, HTTP_ENDPOINT } from '$lib/config'
import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'

export async function load({ params, query, setHeaders, locals, parent, cookies, request }) {
	const { store } = locals

	try {
		const home = await gett(`home?store=${store?.id}`, request.headers.get('cookie'))
		// const deals = await gett(`deals?store=${store?.id}`, request.headers.get('cookie'))
		setHeaders({
			'cache-control': 'public, max-age=3600'
		})
		if (home) {
			return { home: home }
			// deals: deals
		}
	} catch (e) {
		throw error(
			404,
			`Store Not Found @Page 
			<br/>ID: ${locals.store.id}
			<br/>ORIGIN: ${locals.origin}
			<br/>DOMAIN(env):${DOMAIN}
			<br/>HTTP_ENDPOINT(env):${HTTP_ENDPOINT}`
		)
	}
}
