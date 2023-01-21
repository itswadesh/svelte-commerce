export const prerender = false
import { DOMAIN, HTTP_ENDPOINT, listOfPagesWithoutBackButton } from '$lib/config'
import { error } from '@sveltejs/kit'

export async function load({ url, request, locals, cookies, setHeaders }) {
	try {
		const isDesktop = request.headers.get('sec-ch-ua-mobile') === '?0'
		const isShowBackButton = !listOfPagesWithoutBackButton.includes(url?.pathname)
		const currentPage = +url.searchParams.get('page') || 1
		const q = url.searchParams.get('q') || ''
		const d1 = new Date()
		locals.url = url.href
		locals.currentPage = currentPage
		locals.q = q
		locals.isDesktop = isDesktop
		locals.isShowBackButton = isShowBackButton
		setHeaders({
			'cache-control': 'public, max-age=604800'
		})
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
