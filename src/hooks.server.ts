import type { Handle } from '@sveltejs/kit'
// import { getAPI } from '$lib/util/api'
// @ts-ignore
import { PUBLIC_DOMAIN } from '$env/static/public'
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
	GOOGLE_CLIENT_ID
} from '$lib/config'
import { gett } from '$lib/utils'
// import Cookie from 'cookie-universal'

/** @type {import('@sveltejs/kit').HandleFetch} */
export const handleFetch = async ({ event, request, fetch }) => {
	request.headers.set('cookie', event.request.headers.get('cookie'), { path: '/' })

	return fetch(request)
}
/** @type {import('@sveltejs/kit').HandleServerError} */
export const handleError = async ({ error }) => {
	return {
		message: 'Whoops!',
		code: error.code ?? 'UNKNOWN'
	}
}
export const handle: Handle = async ({ event, resolve }) => {
	const WWW_URL = new URL(event.request.url).origin
	event.locals.origin = WWW_URL
	const cookieStore = event.cookies.get('store')
	let store = {
		id,
		domain,
		logo,
		email,
		address,
		phone,
		otpLogin: false,
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
		stripePublishableKey
	}
	if (!cookieStore || cookieStore === 'undefined') {
		const HOST = PUBLIC_DOMAIN
		const url = new URL(event.request.url)
		const storeRes = await gett(`init?domain=${HOST || url.host}`)
		const { storeOne } = storeRes
		store = {
			id: storeOne._id,
			domain: storeOne.domain,
			email: storeOne.email,
			address: storeOne.address,
			phone: storeOne.phone,
			otpLogin: storeOne.otpLogin,
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
			GOOGLE_ANALYTICS_ID: storeOne.GOOGLE_ANALYTICS_ID
		}
		event.cookies.set('store', JSON.stringify(store), { path: '/' })
	} else {
		store = JSON.parse(cookieStore)
	}

	event.locals.store = store

	let me: any = event.cookies.get('me')
	if (!me) {
		try {
			if (me) {
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
		} catch (e) {
			console.log('eeeeeeeeeeeeee', e)
		}
	} else {
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
	// load page as normal
	event.request.headers.delete('connection')
	return await resolve(event)
}
