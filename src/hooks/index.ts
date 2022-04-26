import cookie from 'cookie'
import type { Handle } from '@sveltejs/kit'
import { DOMAIN } from '$lib/config'
import { KQL_Init } from '$lib/graphql/_kitql/graphqlStores'

export const handle: Handle = async ({ event, resolve }) => {
	let store,
		headers,
		serializedCookie,
		settings = {},
		megamenu = [],
		sid,
		token
	// me.gql and cart.gql can not be called here because of unabailability of session cookie. Hence there are executed at __layout.reset.svelte or $lib/Nav.svelte
	const request = event.request
	const cookies = cookie.parse(request.headers.get('cookie') || '') || {}
	const domain = DOMAIN || request.headers.get('host')
	if (cookies.store) store = cookies.store && JSON.parse(cookies.store)
	const INIT = (
		await KQL_Init.query({
			fetch,
			variables: { domain }
		})
	).data
	store = store = INIT?.storeOne
	settings = INIT?.settings
	megamenu = INIT?.megamenu
	if (cookies.me) {
		sid = cookies.sid
		token = cookies.token
	}

	const geo = cookies.geo && JSON.parse(cookies.geo)
	// if (event.url.searchParams.has('_method')) {
	// event.method = event.url.searchParams.get('_method').toUpperCase()
	// }
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
		geo
	}
	const response = await resolve(event)
	if (store) {
		// const COOKIE_NAME = 'store'
		// const secure = process.env.NODE_ENV === 'production'
		// const maxAge = 7200 // (3600 seconds / hour) * 2 hours
		// const sameSite = 'Strict'
		const { id, email, address, phone, websiteName, websiteLegalName, stripePublishableKey } = store
		const stringifiedData =
			JSON.stringify({
				id,
				domain,
				address,
				phone,
				email,
				websiteName,
				websiteLegalName,
				stripePublishableKey
			}) || ''
		// const setCookieValue = `${COOKIE_NAME}=${stringifiedData}; Max-Age=${maxAge}; Path=/; ${
		// 	secure ? 'Secure;' : ''
		// } HttpOnly; SameSite=${sameSite}`
		serializedCookie = cookie.serialize('store', stringifiedData, { path: '/' })
	}
	response.headers.set('Set-Cookie', serializedCookie)
	return response
}

export const getSession = ({ locals }) => {
	const { token, geo, store, loginUrl, domain, sid, categories, settings, megamenu } = locals
	return {
		loginUrl,
		megamenu,
		settings,
		domain,
		store,
		geo,
		sid,
		token,
		DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE
	}
}
