export const prerender = false

import { DOMAIN, HTTP_ENDPOINT } from '$lib/config'
import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'

export async function load({ url, request, locals, cookies }) {
	try {
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
		// const isHome = url.pathname === '/'
		const currentPage = +url.searchParams.get('page') || 1
		const q = url.searchParams.get('q') || ''
		// let cart, store, me, serializedCart, serializedStore, serializedMe

		const d1 = new Date()

		// try {
		// 	const ck = request.headers.get('cookie')
		// 	const stringifiedMe = cookie.parse(ck).me
		// 	me = JSON.parse(stringifiedMe)

		// 	serializedMe = cookie.serialize('me', stringifiedMe || '', {
		// 		path: '/',
		// 	})
		// 	cookies.set(serializedMe)
		// } catch (e) {
		// } finally {
		// }

		// let res
		// try {
		// 	res = await Promise.allSettled([
		// 		getAPI(`categories/megamenu?megamenu=true&store=${id}`),
		// 		getAPI('carts/my'),
		// 	])
		// } catch (e) {
		// } finally {
		// }
		// const megamenu = res[0].status === 'fulfilled' ? res[0].value : []
		// const d2 = new Date()
		// console.log('Megamenu+Cart loaded at layout: ', d2.getTime() - d1.getTime())
		// if (res[1]) {
		// 	const cartRes = res[1].status === 'fulfilled' ? res[1].value : {}
		// 	const cookieCart = {
		// 		items: cartRes.items,
		// 		qty: cartRes.qty,
		// 		tax: cartRes.tax,
		// 		subtotal: cartRes.subtotal,
		// 		total: cartRes.total,
		// 		currencySymbol: cartRes.currencySymbol,
		// 		discount: cartRes.discount,
		// 		selfTakeout: cartRes.selfTakeout,
		// 		shipping: cartRes.shipping,
		// 		unavailableItems: cartRes.unavailableItems,
		// 		formattedAmount: cartRes.formattedAmount,
		// 	}
		// 	cart = cookieCart
		// 	serializedCart = cookie.serialize(
		// 		'cart',
		// 		JSON.stringify(cookieCart) || '',
		// 		{
		// 			path: '/',
		// 		}
		// 	)
		// 	cookies.set(serializedCart)
		// }
		// const d3 = new Date()

		// console.log('Cart loaded........', d3.getTime() - d2.getTime())

		// try {
		// 	const cookieStore = {
		// 		id,
		// 		domain,
		// 		logo: `/logo.svg?tr=w-auto,h-56:w-auto,h-56`,
		// 		address,
		// 		phone,
		// 		email,
		// 		websiteName,
		// 		websiteLegalName,
		// 		stripePublishableKey,
		// 		// kitqlCartId: event.locals['kitqlCartId'],
		// 	}

		// 	store = cookieStore
		// 	serializedStore = cookie.serialize(
		// 		'store',
		// 		JSON.stringify(cookieStore) || '',
		// 		{
		// 			path: '/',
		// 		}
		// 	)
		// 	cookies.set(serializedStore)
		// } catch (e) {
		// } finally {
		// }

		// setHeaders({
		// 	'cache-control': 'public, max-age=7200, must-revalidate'
		// })
		// const cart = cookies.get('cart')
		// locals.cart = JSON.parse(cart)
		// const cartRes = await gett('carts/my', request.headers.get('cookie'))
		// const cart = {
		// 	cartId: cartRes.cart_id,
		// 	items: cartRes.items,
		// 	qty: cartRes.qty,
		// 	tax: cartRes.tax,
		// 	subtotal: cartRes.subtotal,
		// 	total: cartRes.total,
		// 	currencySymbol: cartRes.currencySymbol,
		// 	discount: cartRes.discount,
		// 	selfTakeout: cartRes.selfTakeout,
		// 	shipping: cartRes.shipping,
		// 	unavailableItems: cartRes.unavailableItems,
		// 	formattedAmount: cartRes.formattedAmount
		// }
		// locals.cart = cart
		locals.url = url.href
		locals.currentPage = currentPage
		locals.q = q
		// me,
		locals.isDesktop = isDesktop
		locals.isShowBackButton = isShowBackButton
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
