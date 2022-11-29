import { error, type Handle } from '@sveltejs/kit'
import { SECRET_SENTRY_DSN } from '$env/static/private'
const SENTRY_DSN = SECRET_SENTRY_DSN
import {
	stripePublishableKey,
	id,
	logo,
	email,
	address,
	phone,
	websiteName,
	websiteLegalName,
	domain,
	description,
	keywords,
	siteTitle,
	facebookPage,
	linkedinPage,
	instagramPage,
	twitterPage,
	pinterestPage,
	youtubeChannel,
	GOOGLE_ANALYTICS_ID,
	GOOGLE_CLIENT_ID,
	DOMAIN,
	WWW_URL,
	HTTP_ENDPOINT
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
/** @type {import('@sveltejs/kit').HandleServerError} */
export const handleError = async ({ error, event }) => {
	Sentry.captureException(error, { event })
	return {
		message: 'Whoops!',
		code: error.code ?? 'UNKNOWN'
	}
}
export const handle: Handle = async ({ event, resolve }) => {
	try {
		const WWW_URL1 = new URL(event.request.url).origin
		event.locals.origin = WWW_URL || WWW_URL1 // https not coming in coolify hence hard coded in .env
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
			domain,
			logo,
			email,
			address,
			phone,
			websiteName,
			websiteLegalName,
			title: siteTitle,
			description,
			keywords,
			facebookPage,
			instagramPage,
			twitterPage,
			linkedinPage,
			pinterestPage,
			youtubeChannel,
			GOOGLE_CLIENT_ID,
			GOOGLE_ANALYTICS_ID,
			stripePublishableKey,
			DOMAIN,
			isFnb: false,
			weightUnit: 'g',
			dimentionUnit: 'cm'
		}
		if (!cookieStore || cookieStore === 'undefined') {
			const url = new URL(event.request.url)
			const storeRes = await getBySid(`init?domain=${DOMAIN || url.host}`)
			const { storeOne } = storeRes
			store = {
				id: storeOne._id,
				domain: storeOne.domain,
				email: storeOne.websiteEmail,
				address: storeOne.address,
				phone: storeOne.phone,
				websiteLegalName: storeOne.websiteLegalName,
				websiteName: storeOne.websiteName,
				title: storeOne.title,
				description: storeOne.description,
				keywords: storeOne.keywords,
				stripePublishableKey: storeOne.stripePublishableKey,
				logo: storeOne.logo,
				facebookPage: storeOne.facebookPage,
				instagramPage: storeOne.instagramPage,
				twitterPage: storeOne.twitterPage,
				linkedinPage: storeOne.linkedinPage,
				pinterestPage: storeOne.pinterestPage,
				youtubeChannel: storeOne.youtubeChannel,
				GOOGLE_CLIENT_ID: storeOne.GOOGLE_CLIENT_ID,
				GOOGLE_ANALYTICS_ID: storeOne.GOOGLE_ANALYTICS_ID,
				isFnb: storeOne.isFnb,
				DOMAIN: storeOne.DOMAIN,
				weightUnit: storeOne.weightUnit,
				dimentionUnit: storeOne.dimentionUnit
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
				email: me.email,
				phone: me.phone,
				firstName: me.firstName,
				lastName: me.lastName,
				avatar: me.avatar,
				role: me.role,
				verified: me.verified,
				active: me.active
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
		console.log('Err at Hooks...', e)
		throw error(404, err)
	}
}
