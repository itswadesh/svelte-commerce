import { error, type Handle } from '@sveltejs/kit'
import { SECRET_SENTRY_DSN } from '$env/static/private'
const SENTRY_DSN = SECRET_SENTRY_DSN
import {
	id,
	address,
	closedMessage,
	description,
	domain,
	DOMAIN,
	email,
	facebookPage,
	GOOGLE_ANALYTICS_ID,
	GOOGLE_CLIENT_ID,
	HTTP_ENDPOINT,
	instagramPage,
	keywords,
	linkedinPage,
	logo,
	phone,
	pinterestPage,
	siteTitle,
	stripePublishableKey,
	twitterPage,
	websiteLegalName,
	websiteName,
	WWW_URL,
	youtubeChannel
} from '$lib/config'
import { getBySid } from '$lib/utils'
// import Cookie from 'cookie-universal'
import * as Sentry from '@sentry/svelte'
import { BrowserTracing } from '@sentry/tracing'

if (SENTRY_DSN) {
	Sentry.init({
		dsn: SENTRY_DSN,
		integrations: [new BrowserTracing()],
		tracesSampleRate: 1.0
	})
}

/** @type {import('@sveltejs/kit').HandleFetch} */
export const handleFetch = async ({ event, request, fetch }) => {
	request.headers.set('cookie', event.request.headers.get('cookie'))

	return fetch(request)
}

// /** @type {import('@sveltejs/kit').HandleServerError} */
// export const handleError = async ({ error, event }) => {
// 	Sentry.captureException(error, { event })
// 	return {
// 		message: 'Whoops!',
// 		code: error.code ?? 'UNKNOWN'
// 	}
// }

export const handle: Handle = async ({ event, resolve }) => {
	try {
		const WWW_URL1 = new URL(event.request.url).origin
		event.locals.origin = WWW_URL || WWW_URL1 // https not coming in coolify hence hard coded in .env
		if (event.locals.origin.includes('.')) {
			event.locals.origin = event.locals.origin.replace('http://', 'https://')
		}
		// console.log(
		// 	'DOMAIN from .env, request url, final origin',
		// 	WWW_URL,
		// 	WWW_URL1,
		// 	event.locals.origin
		// )
		const cookieStore = event.cookies.get('store')
		const zip = event.cookies.get('zip')
		if (zip) {
			event.locals.zip = JSON.parse(zip)
		}
		let store = {
			id,
			address,
			closedMessage,
			description,
			dimentionUnit: 'cm',
			domain,
			DOMAIN,
			email,
			facebookPage,
			GOOGLE_ANALYTICS_ID,
			GOOGLE_CLIENT_ID,
			instagramPage,
			isFnb: false,
			keywords,
			linkedinPage,
			logo,
			phone,
			pinterestPage,
			stripePublishableKey,
			title: siteTitle,
			twitterPage,
			websiteLegalName,
			websiteName,
			weightUnit: 'g',
			youtubeChannel
		}
		if (!cookieStore || cookieStore === 'undefined') {
			const url = new URL(event.request.url)
			const storeRes = await getBySid(`init?domain=${DOMAIN || url.host}`)

			console.log('storeRes', storeRes)

			const { storeOne, settings } = storeRes

			store = {
				id: storeOne._id,
				address: storeOne.address,
				adminUrl: settings.adminUrl,
				closedMessage: storeOne.closedMessage,
				description: storeOne.description,
				dimentionUnit: storeOne.dimentionUnit,
				domain: storeOne.domain,
				DOMAIN: storeOne.DOMAIN,
				email: storeOne.websiteEmail,
				facebookPage: storeOne.facebookPage,
				GOOGLE_ANALYTICS_ID: storeOne.GOOGLE_ANALYTICS_ID,
				GOOGLE_CLIENT_ID: storeOne.GOOGLE_CLIENT_ID,
				instagramPage: storeOne.instagramPage,
				isFnb: storeOne.isFnb,
				keywords: storeOne.keywords,
				linkedinPage: storeOne.linkedinPage,
				logo: storeOne.logo,
				phone: storeOne.phone,
				pinterestPage: storeOne.pinterestPage,
				stripePublishableKey: storeOne.stripePublishableKey,
				title: storeOne.title,
				twitterPage: storeOne.twitterPage,
				websiteLegalName: storeOne.websiteLegalName,
				websiteName: storeOne.websiteName,
				weightUnit: storeOne.weightUnit,
				youtubeChannel: storeOne.youtubeChannel
			}
			event.cookies.set('store', JSON.stringify(store), { path: '/' })
		} else {
			store = JSON.parse(cookieStore)
		}

		event.locals.store = store

		let me: any = event.cookies.get('me')
		// if (!me) {
		// 	try {
		// 		if (me) {
		// 			event.locals.me = {
		// 				email: me.email,
		// 				phone: me.phone,
		// 				firstName: me.firstName,
		// 				lastName: me.lastName,
		// 				avatar: me.avatar,
		// 				role: me.role,
		// 				verified: me.verified,
		// 				active: me.active
		// 			}
		// 		}
		// 	} catch (e) {
		// 		console.log('eeeeeeeeeeeeee', e)
		// 	}
		// } else {
		if (me) {
			me = JSON.parse(me)
			event.locals.me = {
				active: me.active,
				avatar: me.avatar,
				email: me.email,
				firstName: me.firstName,
				lastName: me.lastName,
				phone: me.phone,
				role: me.role,
				verified: me.verified
			}
		}
		const cartId: string = event.cookies.get('cartId')
		const cartQty: string = event.cookies.get('cartQty')
		// const cart: any = event.cookies.get('cart') || '{}'
		event.locals.cartId = cartId
		event.locals.cartQty = +cartQty
		// event.locals.cart = JSON.parse(cart)
		const sid = event.cookies.get('sid')
		const cartRes = await getBySid('carts/my', sid)
		const cart = {
			cartId: cartRes.cart_id,
			items: cartRes.items,
			qty: cartRes.qty,
			tax: cartRes.tax,
			subtotal: cartRes.subtotal,
			total: cartRes.total,
			currencySymbol: cartRes.currencySymbol,
			discount: cartRes.discount,
			selfTakeout: cartRes.selfTakeout,
			shipping: cartRes.shipping,
			unavailableItems: cartRes.unavailableItems,
			formattedAmount: cartRes.formattedAmount
		}
		event.locals.cart = cart
		// load page as normal
		event.request.headers.delete('connection')
		return await resolve(event)
	} catch (e) {
		const err = `Store Not Found @Hook 
			<br/>ID: ${event.locals.store?.id}
			<br/>ORIGIN: ${event.locals?.origin}
			<br/>DOMAIN(env): ${DOMAIN}
			<br/>HTTP_ENDPOINT(env): ${HTTP_ENDPOINT}`
		// console.log('Err at Hooks...', e)
		throw error(404, err)
	}
}
