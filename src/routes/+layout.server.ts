export const prerender = false

import { DOMAIN, HTTP_ENDPOINT } from '$lib/config'
import { error } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ url, locals, cookies }) => {
	try {
		const currentPage = +url.searchParams.get('page') || 1
		const q = url.searchParams.get('q') || ''
		locals.currentPage = currentPage
		locals.q = q
		locals.sid = cookies.get('connect.sid')
		locals.url = url.href
		locals.zip = cookies.get('zip')

		// setHeaders({
		// 	'cache-control': 'public, max-age=300'
		// })

		return locals
	} catch (e) {
		throw error(
			404,
			`Store Not Found @Layout 
			<br/>ID: ${locals.store.id}
			<br/>ORIGIN: ${locals.origin}
			<br/>DOMAIN(env): ${DOMAIN}
			<br/>HTTP_ENDPOINT(env): ${HTTP_ENDPOINT}`
		)
	}
}
