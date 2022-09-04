import { getAPI } from '$lib/util/api'
import { DOMAIN, HTTP_ENDPOINT } from '$lib/config'
import cookie from 'cookie'
export const prerender = false
import {
	stripePublishableKey,
	id,
	email,
	address,
	phone,
	websiteName,
	websiteLegalName
} from '$lib/config'

export async function load({ url, request, setHeaders }) {
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

	const isHome = url.pathname === '/'
	let currentPage = +url.searchParams.get('page') || 1
	let q = url.searchParams.get('q') || ''
	let cart, store, me, serializedCart, serializedStore, serializedMe
	try {
		const res = await getAPI('carts/my', request.headers)

		if (res) {
			const cookieCart = {
				items: res?.items,
				qty: res?.qty,
				tax: res?.tax,
				subtotal: res?.subtotal,
				total: res?.total,
				currencySymbol: res?.currencySymbol,
				discount: res?.discount,
				selfTakeout: res?.selfTakeout,
				shipping: res?.shipping,
				unavailableItems: res?.unavailableItems,
				formattedAmount: res?.formattedAmount
			}
			cart = cookieCart
			serializedCart = cookie.serialize('cart', JSON.stringify(cookieCart) || '', {
				path: '/'
			})
			setHeaders({ cart: serializedCart })
		}
	} catch (e) {
	} finally {
	}
	try {
		const cookieStore = {
			id,
			domain: DOMAIN,
			logo: `/logo.png?tr=w-auto,h-56:w-auto,h-56`,
			address,
			phone,
			email,
			websiteName,
			websiteLegalName,
			stripePublishableKey
			// kitqlCartId: event.locals['kitqlCartId'],
		}

		store = cookieStore
		serializedStore = cookie.serialize('store', JSON.stringify(cookieStore) || '', {
			path: '/'
		})
		setHeaders({ store: serializedStore })
	} catch (e) {
	} finally {
	}

	try {
		const ck = request.headers.get('cookie')
		const stringifiedMe = cookie.parse(ck).me
		me = JSON.parse(stringifiedMe)

		serializedMe = cookie.serialize('me', stringifiedMe || '', {
			path: '/'
		})
		setHeaders({ me: serializedMe })
	} catch (e) {
	} finally {
	}

	return {
		url: url.href,
		currentPage,
		q,
		me,
		isDesktop,
		isShowBackButton,
		// token,
		// sid,
		cart,
		store
		// isHome
	}
}
