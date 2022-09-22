import cookie, { serialize } from 'cookie'
import type { Handle } from '@sveltejs/kit'
import { getAPI } from '$lib/util/api'
import { v4 as uuidv4 } from 'uuid'
// import UAParser from 'ua-parser-js'

import {
	stripePublishableKey,
	id,
	email,
	address,
	phone,
	websiteName,
	websiteLegalName
} from '$lib/config'
import { DOMAIN, HTTP_ENDPOINT } from '$lib/config'
// import type { RequestEvent } from '@sveltejs/kit/types/private'
// import Cookie from 'cookie-universal'
// const coookies = Cookie()
// https://gist.github.com/acoyfellow/d8e86979c66ebea25e1643594e38be73
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
// https://scotthelme.co.uk/content-security-policy-an-introduction/
// scanner: https://securityheaders.com/

const rootDomain = import.meta.env.VITE_DOMAIN // or your server IP for dev

// const directives = {
// 	'base-uri': ["'self'"],
// 	'child-src': ["'self'"],
// 	// 'connect-src': ["'self'", 'ws://localhost:*'],
// 	// 'connect-src': ["'self'", 'ws://localhost:*', 'https://hcaptcha.com', 'https://*.hcaptcha.com'],
// 	// 'img-src': ["'self'", 'data:'],
// 	// 'font-src': ["'self'", 'data:'],
// 	'form-action': ["'self'"],
// 	'frame-ancestors': ["'self'"],
// 	'frame-src': [
// 		"'self'",
// 		'https://*.youtube.com'
// 		// "https://*.facebook.com",
// 		// "https://*.facebook.net",
// 		// 'https://hcaptcha.com',
// 		// 'https://*.hcaptcha.com',
// 	],
// 	'manifest-src': ["'self'"],
// 	'media-src': ["'self'", 'data:'],
// 	'object-src': ["'none'"],
// 	// 'style-src': ["'self'", "'unsafe-inline'"],
// 	// 'style-src': ["'self'", "'unsafe-inline'", 'https://hcaptcha.com', 'https://*.hcaptcha.com'],
// 	// 'default-src': [
// 	//   "'self'",
// 	//   rootDomain,
// 	//   `ws://${rootDomain}`,
// 	//   // 'https://*.google.com',
// 	//   // 'https://*.googleapis.com',
// 	//   // 'https://*.firebase.com',
// 	//   // 'https://*.gstatic.com',
// 	//   // 'https://*.cloudfunctions.net',
// 	//   // 'https://*.algolia.net',
// 	//   // 'https://*.facebook.com',
// 	//   // 'https://*.facebook.net',
// 	//   // 'https://*.stripe.com',
// 	//   // 'https://*.sentry.io',
// 	// ],
// 	'script-src': [
// 		"'self'",
// 		"'unsafe-inline'"
// 		// 'https://*.stripe.com',
// 		// 'https://*.facebook.com',
// 		// 'https://*.facebook.net',
// 		// 'https://hcaptcha.com',
// 		// 'https://*.hcaptcha.com',
// 		// 'https://*.sentry.io',
// 		// 'https://polyfill.io',
// 	],
// 	'worker-src': ["'self'"],
// 	// remove report-to & report-uri if you do not want to use Sentry reporting
// 	'report-to': ["'csp-endpoint'"],
// 	'report-uri': [
// 		`https://sentry.io/api/${import.meta.env.VITE_SENTRY_PROJECT_ID}/security/?sentry_key=${
// 			import.meta.env.VITE_SENTRY_KEY
// 		}`
// 	]
// }

// const csp = Object.entries(directives)
// 	.map(([key, arr]) => key + ' ' + arr.join(' '))
// 	.join('; ')

export const handle: Handle = async ({ event, resolve }) => {
	let store,
		cart,
		headers,
		serializedCookie,
		settings,
		megamenu,
		sid,
		token,
		zip,
		domain,
		geo,
		me,
		ip
	// me.gql and cart.gql can not be called here because of unabailability of session cookie. Hence there are executed at __layout.reset.svelte or $lib/Nav.svelte
	const request = event.request
	// var parser = new UAParser()
	// let mobile = parser.getResult().device['type'] == 'mobile'
	// console.log('isMobile', mobile)
	request.headers.delete('connection')

	// const cookies = cookie.parse(request.headers.get('cookie') || '') || {}
	// event.locals['kitqlCartId'] = cookies.kitqlCartId || uuidv4()
	// const host = event.request.headers.get('host')
	// domain = DOMAIN
	// if (cookies.store) store = cookies.store && JSON.parse(cookies.store)
	// zip = cookies.zip
	try {
		// const INIT = await getAPI('init?domain=' + domain, request.headers)
		// console.log('Hook....................', domain, store?.id, INIT.storeOne.id)
		// let uri = new URL(`${HTTP_ENDPOINT}/api/init?domain=${domain}`)
		// let resBeforeJson = await fetch(uri.toString(), { method: 'get' })
		// let INIT = await resBeforeJson.json()
		// console.log('Hooks Handle..........', domain, INITRes)
		// store = {
		// 	id,
		// 	email,
		// 	address,
		// 	phone,
		// 	websiteName,
		// 	websiteLegalName,
		// 	stripePublishableKey
		// } //INIT?.storeOne
		// settings = {} //INIT?.settings
		// megamenu = {} //INIT?.megamenu
		// 	fetch,
		// 	variables: { store: store?.id }
		// })
		// if (cookies.me) {
		// 	me = cookies.me && JSON.parse(cookies.me)
		// 	sid = cookies.sid
		// 	token = cookies.token
		// }
		// if (cookies.cart) {
		// 	cart = cookies.cart && JSON.parse(cookies.cart)
		// }
		// geo = cookies.geo && JSON.parse(cookies.geo)
	} catch (e) {
		console.error('Hooks err...............', e)
	}
	// me = cookies.me && JSON.parse(cookies.me)
	// if (event.url.searchParams.has('_method')) {
	// 	event.method = event.url.searchParams.get('_method').toUpperCase()
	// }
	// event.locals = {
	// 	store,
	// 	headers,
	// 	serializedCookie,
	// 	settings,
	// 	megamenu,
	// 	geo,
	// 	zip,
	// 	sid,
	// 	token,
	// 	domain,
	// 	loginUrl: settings?.otpLogin ? '/auth/otp-login' : '/auth/login',
	// 	// kitqlCartId: event.locals['kitqlCartId'],
	// 	me,
	// 	cart
	// }
	const response = await resolve(event)

	// if (!cookies.kitqlCartId) {
	//   // if this is the first time the user has visited this app,
	//   // set a cookie so that we recognise them when they return
	//   response.headers.set(
	//     'Set-Cookie',
	//     cookie.serialize('kitqlCartId', event.locals['kitqlCartId'], {
	//       path: '/',
	//       httpOnly: true,
	//     })
	//   )
	// }
	// if (sid && !cookies.sid) {
	// 	response.headers.set(
	// 		'Set-Cookie',
	// 		cookie.serialize('sid', sid.toString(), { path: '/', httpOnly: true })
	// 	)
	// }
	// if (geo && !cookies.geo) {
	// 	response.headers.set(
	// 		'Set-Cookie',
	// 		cookie.serialize('geo', JSON.stringify(geo), { path: '/', httpOnly: true })
	// 	)
	// }
	// , { // Creates issue with logout
	// 	ssr: !event.url.pathname.startsWith('/my'),
	// })
	if (store) {
		// const COOKIE_NAME = 'store'
		// const secure = process.env.NODE_ENV === 'production'
		// const maxAge = 7200 // (3600 seconds / hour) * 2 hours
		// const sameSite = 'Strict'
		// const { id, email, address, phone, websiteName, websiteLegalName, stripePublishableKey } = store
		// const stringifiedStoreData =
		// 	JSON.stringify({
		// 		id,
		// 		domain,
		// 		address,
		// 		phone,
		// 		email,
		// 		websiteName,
		// 		websiteLegalName,
		// 		stripePublishableKey
		// 		// kitqlCartId: event.locals['kitqlCartId'],
		// 	}) || ''
		// const setStoreCookieValue = `${COOKIE_NAME}=${stringifiedStoreData}; Max-Age=${maxAge}; Path=/; ${
		// 	secure ? 'Secure;' : ''
		// } HttpOnly; SameSite=${sameSite}` // This line is important else footer will not populate
		// response.headers.set(
		// 	'Set-Cookie',
		// 	cookie.serialize('store', stringifiedStoreData, { path: '/' })
		// )
	}
	// response.headers.set('X-Frame-Options', 'SAMEORIGIN')
	// response.headers.set('Referrer-Policy', 'no-referrer')
	// response.headers.set(
	// 	'Permissions-Policy',
	// 	'accelerometer=(), autoplay=(), camera=(), document-domain=(), encrypted-media=(), fullscreen=(), gyroscope=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), xr-spatial-tracking=(), geolocation=()'
	// )
	// // response.headers.set('X-Content-Type-Options', 'nosniff')
	// /* Switch from Content-Security-Policy-Report-Only to Content-Security-Policy once you are satisifed policy is what you want
	//  * on switch comment out the Report-Only line
	//  */
	// response.headers.set('Content-Security-Policy-Report-Only', csp)
	// // response.headers.set('Content-Security-Policy', csp);
	// response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
	// response.headers.set(
	// 	'Expect-CT',
	// 	`max-age=86400, report-uri="https://sentry.io/api/${
	// 		import.meta.env.VITE_SENTRY_PROJECT_ID
	// 	}/security/?sentry_key=${import.meta.env.VITE_SENTRY_KEY}"`
	// )
	// response.headers.set(
	// 	'Report-To',
	// 	`{group: "csp-endpoint", "max_age": 10886400, "endpoints": [{"url": "https://sentry.io/api/${
	// 		import.meta.env.VITE_SENTRY_PROJECT_ID
	// 	}/security/?sentry_key=${import.meta.env.VITE_SENTRY_KEY}"}]}`
	// )
	return response
}

export const getSession = ({ locals }) => {
	// const {
	// 	token,
	// 	loginUrl,
	// 	domain,
	// 	sid,
	// 	zip,
	// 	// kitqlCartId,
	// 	categories,
	// 	settings,
	// 	store,
	// 	megamenu,
	// 	me,
	// 	cart
	// } = locals
	// return {
	// 	me,
	// 	cart,
	// 	zip,
	// 	// kitqlCartId,
	// 	loginUrl,
	// 	store,
	// 	settings,
	// 	domain,
	// 	sid,
	// 	token,
	// 	DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE
	// }
}

// export const serverFetch = async (request) => {
// 	if (request.url.startsWith('https://api.yourapp.com/')) {
// 		// clone the original request, but change the URL
// 		request = new Request(
// 			request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),
// 			request
// 		)
// 	}

// 	return fetch(request)
// }
