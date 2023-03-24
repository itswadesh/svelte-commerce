import { error, type Handle } from '@sveltejs/kit'
import { SECRET_SENTRY_DSN } from '$env/static/private'
const SENTRY_DSN = SECRET_SENTRY_DSN
import * as Sentry from '@sentry/svelte'
import { BrowserTracing } from '@sentry/tracing'
import { DOMAIN, HTTP_ENDPOINT, listOfPagesWithoutBackButton } from '$lib/config'
import { fetchStoreData, authenticateUser, fetchCart } from '$lib/server'

try {
	Sentry.init({
		dsn: SENTRY_DSN,
		integrations: [new BrowserTracing()],
		tracesSampleRate: 1.0
	})
} catch (error) {
	console.warn('Skipping Sentry...') // Now you may skip sentry logging
}

/** @type {import('@sveltejs/kit').HandleFetch} */
export const handleFetch = async ({ event, request, fetch }) => {
	request.headers.set('cookie', event.request.headers.get('cookie'), { path: '/' })

	return fetch(request)
}

export const handle: Handle = async ({ event, resolve }) => {
	try {
		const url = new URL(event.request.url)
		const destinationOrigin = DOMAIN || url.host
		event.locals.origin = !IS_DEV ? `https://${destinationOrigin}` : `http://${url.host}`
		const isDesktop = event.request.headers.get('sec-ch-ua-mobile') === '?0'
		event.locals.isDesktop = isDesktop
		const isShowBackButton = !listOfPagesWithoutBackButton.includes(url?.pathname)
		event.locals.isShowBackButton = isShowBackButton
		event.locals.store = await fetchStoreData(event)
		event.locals.me = await authenticateUser(event)
		event.locals.cart = await fetchCart(event)
		// Bellow conversion is for medusajs
		// const derivedSid: string = event.cookies.get('connect.sid') || ''
		// event.locals.sid = derivedSid
		// event.cookies.set('sid', derivedSid, { path: '/' })
		// event.request.headers.delete('connection')
		const route = event.url
		let start = performance.now()
		const response = await resolve(event)
		let end = performance.now()

		let responseTime = end - start

		if (responseTime > 1000) {
			console.log(`🐢 ${route} took ${responseTime.toFixed(2)} ms`)
		}

		if (responseTime < 100) {
			console.log(`🚀 ${route} took ${responseTime.toFixed(2)} ms`)
		}

		return response
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
