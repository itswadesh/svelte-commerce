import { error, type Handle } from '@sveltejs/kit'
import { SECRET_SENTRY_DSN } from '$env/static/private'
const SENTRY_DSN = SECRET_SENTRY_DSN
import * as Sentry from '@sentry/svelte'
import { BrowserTracing } from '@sentry/tracing'
import { DOMAIN, HTTP_ENDPOINT, listOfPagesWithoutBackButton, WWW_URL } from '$lib/config'
import { fetchStoreData, authenticateUser, fetchCart } from '$lib/server'

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

export const handle: Handle = async ({ event, resolve }) => {
	try {
		const WWW_URL1 = new URL(event.request.url).origin
		event.locals.origin = WWW_URL || WWW_URL1 // https not coming in coolify hence hard coded in .env
		if (event.locals.origin.includes('.')) {
			event.locals.origin = event.locals.origin.replace('http://', 'https://')
		}
		const isDesktop = event.request.headers.get('sec-ch-ua-mobile') === '?0'
		event.locals.isDesktop = isDesktop
		const isShowBackButton = !listOfPagesWithoutBackButton.includes(event.request.url?.pathname)
		event.locals.isShowBackButton = isShowBackButton
		event.locals.store = await fetchStoreData(event)
		event.locals.me = await authenticateUser(event)
		event.locals.cart = await fetchCart(event)
		// event.request.headers.delete('connection')
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
