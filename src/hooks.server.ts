// import * as SentryNode from '@sentry/node'
import { authenticateUser, fetchCart } from '$lib/server'
import { DOMAIN, HTTP_ENDPOINT, listOfPagesWithoutBackButton } from '$lib/config'
import { error, type Handle, type HandleServerError } from '@sveltejs/kit'
import { nanoid } from 'nanoid'
import { InitService } from '$lib/services'

// const SENTRY_DSN = env.SECRET_SENTRY_DSN

// if (SENTRY_DSN && SENTRY_DSN !== 'YOUR_SENTRY_DSN') {
// 	SentryNode.init({
// 		dsn: SENTRY_DSN
// 	})
// }

/** @type {import('@sveltejs/kit').HandleFetch} */
export const handleFetch = async ({ event, request, fetch }) => {
	request.headers.set('cookie', event.request.headers.get('cookie'), { path: '/' })

	return fetch(request)
}

export const handleError: HandleServerError = ({ error, event }) => {
	const errorId = nanoid()
	// SentryNode.captureException(error, {
	// 	contexts: { sveltekit: { event, errorId } }
	// })

	return {
		message: "An unexpected error occurred. We're working on it.",
		errorId
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	try {
		// console.time('init1')
		const IS_DEV = import.meta.env.DEV
		const url = new URL(event.request.url)

		event.locals.origin = !IS_DEV ? `https://${url.host}` : `http://${url.host}`

		const isDesktop = event.request.headers.get('sec-ch-ua-mobile') === '?0'
		const isShowBackButton = !listOfPagesWithoutBackButton.includes(url?.pathname)

		event.locals.isDesktop = isDesktop
		event.locals.isShowBackButton = isShowBackButton

		const { menu, storeOne } = await InitService.fetchInit(url.host)
		// console.log('menu at hooks.server.is', menu);
		// console.log('storeOne at hooks.server.is', storeOne);

		// This calls init only when store data not present in browser cookies
		// const { storeOne } = await fetchStoreData(event)
		// console.timeEnd('init1')

		event.locals.menu = menu || []
		event.locals.store = storeOne || { store: storeOne._id }
		// event.locals.megamenu = megamenu || []

		// this simply gets data from cookie
		event.locals.me = await authenticateUser(event)

		// This makes a call to backend on every request
		await fetchCart(event)

		// const derivedSid: string = event.cookies.get('connect.sid') || ''
		// const route = event.url
		// const start = performance.now()
		// event.locals.sid = derivedSid
		// event.request.headers.delete('connection')
		const response = await resolve(event)

		// const end = performance.now()
		// const responseTime = end - start

		// if (responseTime > 1000) {
		// 	// console.log(`🐢 ${route} took ${responseTime.toFixed(2)} ms`)
		// }

		// if (responseTime < 100) {
		// 	// console.log(`🚀 ${route} took ${responseTime.toFixed(2)} ms`)
		// }

		return response
	} catch (e) {
		// If the store is not found, throw a 404 error
		throw error(404, 'Store Not Found');
	}
}
