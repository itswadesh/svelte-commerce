import { authenticateUser, fetchCart, fetchStoreData } from '$lib/server'
import { DOMAIN, HTTP_ENDPOINT, listOfPagesWithoutBackButton } from '$lib/config'
import { error, type Handle, type HandleServerError } from '@sveltejs/kit'
import { nanoid } from 'nanoid'
import { env } from '$env/dynamic/private'
import * as SentryNode from '@sentry/node'

const SENTRY_DSN = env.SECRET_SENTRY_DSN

if (SENTRY_DSN && SENTRY_DSN !== 'YOUR_SENTRY_DSN') {
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
		const IS_DEV = import.meta.env.DEV
		const url = new URL(event.request.url)

		event.locals.origin = !IS_DEV ? `https://${url.host}` : `http://${url.host}`

		const isDesktop = event.request.headers.get('sec-ch-ua-mobile') === '?0'
		const isShowBackButton = !listOfPagesWithoutBackButton.includes(url?.pathname)

		event.locals.isDesktop = isDesktop
		event.locals.isShowBackButton = isShowBackButton

		// This calls init only when store data not present in browser cookies
		const { megamenu, storeOne } = await fetchStoreData(event)

		event.locals.store = storeOne
		event.locals.megamenu = megamenu

		// this simply gets data from cookie
		event.locals.me = await authenticateUser(event)

		// This makes a call to backend on every request
		event.locals.cart = await fetchCart(event)

		// const derivedSid: string = event.cookies.get('connect.sid') || ''
		// const route = event.url
		// const start = performance.now()
		// event.cookies.set('sid', derivedSid, { path: '/' })
		// event.locals.sid = derivedSid
		// event.request.headers.delete('connection')

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

		throw error(404, err)
	}
}
