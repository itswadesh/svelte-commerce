import type { Handle } from '@sveltejs/kit'
// import { getAPI } from '$lib/util/api'
import { DOMAIN } from '$lib/config'
import {
	stripePublishableKey,
	id,
	email,
	address,
	phone,
	websiteName,
	websiteLegalName
} from '$lib/config'
import { gett, post } from '$lib/utils'
// import Cookie from 'cookie-universal'

/** @type {import('@sveltejs/kit').HandleFetch} */
export const handleFetch = async ({ event, request, fetch }) => {
	request.headers.set('cookie', event.request.headers.get('cookie'))

	return fetch(request)
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export const handleError = async ({ error, event }) => {
	console.log('Server handleError', error)
	//   Sentry.captureException(error, { event });

	return {
		message: 'Whoops!',
		code: error.code ?? 'UNKNOWN'
	}
}
export const handle: Handle = async ({ event, resolve }) => {
	// const st = localStore('megamenu', { children: [], total: 0 })

	const d = new Date()
	const store = {
		id,
		domain: DOMAIN,
		logo: `/logo.svg?tr=w-auto,h-56:w-auto,h-56`,
		address,
		phone,
		email,
		websiteName,
		websiteLegalName,
		stripePublishableKey
		// kitqlCartId: event.locals['kitqlCartId'],
	}
	event.locals.store = store

	let me: any = event.cookies.get('me')
	if (!me) {
		try {
			const session: string = event.cookies.get('session')
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
	const d2 = new Date()
	const cart: any = event.cookies.get('cart')
	if (cart) {
		event.locals.cart = JSON.parse(cart)
	}
	const d4 = new Date()
	// load page as normal
	event.request.headers.delete('connection')
	return await resolve(event)
}
