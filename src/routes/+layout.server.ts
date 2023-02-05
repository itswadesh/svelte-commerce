export const prerender = false

import { DOMAIN, HTTP_ENDPOINT } from '$lib/config'
import { error } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import { CategoryService } from '$lib/services'

export const load: LayoutServerLoad = async ({ url, locals, cookies }) => {
	try {
		const currentPage = +url.searchParams.get('page') || 1
		const q = url.searchParams.get('q') || ''
		const { pathname } = url


		// fetch megamenu and store it in context

		let megamenu = await CategoryService.fetchMegamenuData({
			origin: locals.origin,
			storeId: locals.store?.id,
			isCors: locals.store?.isCors
		})



		// setHeaders({
		// 	'cache-control': 'public, max-age=300'
		// })
		const zip = cookies.get('zip')
		locals.url = url.href
		locals.currentPage = currentPage
		locals.q = q
		locals.sid = cookies.get('connect.sid')
		locals.cartQty = cookies.get('cartQty')
		if (zip) locals.zip = JSON.parse(zip)
		// me,
		return { ...locals, pathname, megamenu }
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
