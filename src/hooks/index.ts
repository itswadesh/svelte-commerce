import cookie, { serialize } from 'cookie'
import type { Handle } from '@sveltejs/kit'
import { DOMAIN } from '$lib/config'
import { GQL_INIT } from '$houdini'
import { v4 as uuidv4 } from 'uuid'
// import fetch from 'node-fetch'

export const handle: Handle = async ({ event, resolve }) => {
	let store, cart, headers, serializedCookie, settings, megamenu, sid, token, domain, geo, me
	// me.gql and cart.gql can not be called here because of unabailability of session cookie. Hence there are executed at __layout.reset.svelte or $lib/Nav.svelte
	const request = event.request
	const cookies = cookie.parse(request.headers.get('cookie') || '') || {}
	event.locals['kitqlCartId'] = cookies.kitqlCartId || uuidv4()
	domain = DOMAIN || request.headers.get('host')
	if (cookies.store) store = cookies.store && JSON.parse(cookies.store)
	try {
		const INIT = (await GQL_INIT.fetch({ event, fetch, variables: { domain } })).data
		store = store = INIT?.storeOne
		settings = INIT?.settings
		megamenu = INIT?.megamenu
		if (cookies.me) {
			me = cookies.me && JSON.parse(cookies.me)
			sid = cookies.sid
			token = cookies.token
		}
	} catch (e) {
		console.log('hOOKS ERR...', e)
	}
	if (event.url.searchParams.has('_method')) {
		event.method = event.url.searchParams.get('_method').toUpperCase()
	}
	event.locals = {
		store,
		headers,
		serializedCookie,
		settings,
		megamenu,
		sid,
		token,
		domain,
		loginUrl: settings?.otpLogin ? '/auth/otp-login' : '/auth/login',
		kitqlCartId: event.locals['kitqlCartId'],
		geo,
		me
	}
	const response = await resolve(event)
	if (!cookies.kitqlCartId) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		response.headers.set(
			'Set-Cookie',
			cookie.serialize('kitqlCartId', event.locals['kitqlCartId'], {
				path: '/',
				httpOnly: true
			})
		)
	}
	if (sid && !cookies.sid) {
		response.headers.set(
			'Set-Cookie',
			cookie.serialize('sid', sid.toString(), { path: '/', httpOnly: true })
		)
	}
	if (store) {
		const COOKIE_NAME = 'store'
		const secure = process.env.NODE_ENV === 'production'
		const maxAge = 7200 // (3600 seconds / hour) * 2 hours
		const sameSite = 'Strict'
		const { id, email, address, phone, websiteName, websiteLegalName, stripePublishableKey } = store
		const stringifiedStoreData =
			JSON.stringify({
				id,
				domain,
				address,
				phone,
				email,
				websiteName,
				websiteLegalName,
				stripePublishableKey,
				kitqlCartId: event.locals['kitqlCartId']
			}) || ''
		const setStoreCookieValue = `${COOKIE_NAME}=${stringifiedStoreData}; Max-Age=${maxAge}; Path=/; ${
			secure ? 'Secure;' : ''
		} HttpOnly; SameSite=${sameSite}` // This line is important else footer will not populate
		response.headers.set(
			'Set-Cookie',
			cookie.serialize('store', stringifiedStoreData, { path: '/' })
		)
	}
	if (geo && !cookies.geo) {
		const COOKIE_NAME = 'geo'
		const secure = process.env.NODE_ENV === 'production'
		const maxAge = 3600 * 2
		const sameSite = 'Strict'
		const stringifiedGeoData = JSON.stringify(geo)
		const setGeoCookieValue = `${COOKIE_NAME}=${stringifiedGeoData}; Max-Age=${maxAge}; Path=/; ${
			secure ? 'Secure;' : ''
		} HttpOnly; SameSite=${sameSite}` // This line is important else footer will not populate
		response.headers.set('Set-Cookie', cookie.serialize('geo', stringifiedGeoData, { path: '/' }))
	}
	return response
}

export const getSession = ({ locals }) => {
	const {
		token,
		geo,
		loginUrl,
		domain,
		sid,
		kitqlCartId,
		categories,
		settings,
		store,
		megamenu,
		me
	} = locals
	return {
		me,
		kitqlCartId,
		loginUrl,
		store,
		settings,
		domain,
		geo,
		sid,
		token,
		DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE
	}
}
