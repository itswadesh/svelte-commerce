import { DOMAIN } from '$lib/config'

export async function load({ url, request, locals, cookies }) {
	const isDesktop = request.headers.get('sec-ch-ua-mobile') === '?0'
	const listOfPagesWithoutBackButton = [
		'/',
		'/categories',
		'/new-arrivals',
		'/my/wishlist',
		'/my',
		'/payment/success'
	]
	const isShowBackButton = !listOfPagesWithoutBackButton.includes(url?.pathname)
	const currentPage = +url.searchParams.get('page') || 1
	const q = url.searchParams.get('q') || ''
	// let cart, store, me, serializedCart, serializedStore, serializedMe

	const d1 = new Date()

	locals.url = url.href
	locals.currentPage = currentPage
	locals.q = q
	// me,
	locals.isDesktop = isDesktop
	locals.isShowBackButton = isShowBackButton
	return locals
}
