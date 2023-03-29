import { error, type Handle, type HandleServerError } from '@sveltejs/kit'
import { SECRET_SENTRY_DSN } from '$env/static/private'
const SENTRY_DSN = SECRET_SENTRY_DSN
import * as SentryNode from '@sentry/node'
import { nanoid } from 'nanoid'
import { authenticateUser, fetchCart, fetchStoreData } from '$lib/server'
import { DOMAIN, HTTP_ENDPOINT, IS_DEV, listOfPagesWithoutBackButton } from '$lib/config'

if (SENTRY_DSN) {
	SentryNode.init({
		dsn: SENTRY_DSN
	})
}

/** @type {import('@sveltejs/kit').HandleFetch} */
export const handleFetch = async ({ event, request, fetch }) => {
	request.headers.set('cookie', event.request.headers.get('cookie'), { path: '/' })

	return fetch(request)
}

export const handleError: HandleServerError = ({ error, event }) => {
	const errorId = nanoid()
	SentryNode.captureException(error, {
		contexts: { sveltekit: { event, errorId } }
	})

	return {
		message: "An unexpected error occurred. We're working on it.",
		errorId
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	try {
		const url = new URL(event.request.url)
		event.locals.origin = !IS_DEV ? `https://${url.host}` : `http://${url.host}`
		const isDesktop = event.request.headers.get('sec-ch-ua-mobile') === '?0'
		const isShowBackButton = !listOfPagesWithoutBackButton.includes(url?.pathname)
		event.locals.isDesktop = isDesktop
		event.locals.isShowBackButton = isShowBackButton
		// This calls init only when store data not present in browser cookies
		event.locals.store = await fetchStoreData(event)
		// this simply gets data from cookie
		event.locals.me = await authenticateUser(event)
		// This makes a call to backend on every request
		event.locals.cart = await fetchCart(event)
		// const derivedSid: string = event.cookies.get('connect.sid') || ''
		// event.locals.sid = derivedSid
		// event.cookies.set('sid', derivedSid, { path: '/' })
		// event.request.headers.delete('connection')
		// const route = event.url
		// const start = performance.now()
		const response = await resolve(event)
		// const end = performance.now()

		// const responseTime = end - start

		// if (responseTime > 1000) {
		// 	console.log(`🐢 ${route} took ${responseTime.toFixed(2)} ms`)
		// }

		// if (responseTime < 100) {
		// 	console.log(`🚀 ${route} took ${responseTime.toFixed(2)} ms`)
		// }

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
