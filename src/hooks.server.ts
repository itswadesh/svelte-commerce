// import * as SentryNode from '@sentry/node'
import { authenticateUser } from '$lib/server'
import { dev } from '$app/environment'
import { DOMAIN, IS_DEV, listOfPagesWithoutBackButton } from '$lib/config'
import { error, type Handle, type HandleServerError } from '@sveltejs/kit'
import { InitService } from '$lib/services'
import { nanoid } from 'nanoid'

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
		const url = new URL(event.request.url)
		const host = url.host
		const protocol = !IS_DEV && !dev ? `https://` : `http://`
		// This is required for vercel as it parse URL as http instead of https
		event.locals.origin = protocol + host
		event.locals.host = url.host

		const userAgent = event.request.headers.get('user-agent')

		const isDesktop = !/mobile/i.test(userAgent)
		const isShowBackButton = !listOfPagesWithoutBackButton.includes(url?.pathname)

		event.locals.isDesktop = isDesktop
		event.locals.isShowBackButton = isShowBackButton

		const storeId = event.cookies.get('storeId')
		if (storeId && storeId != 'undefined') {
			event.locals.storeId = storeId
		} else {
			try {
				const { storeOne } = await InitService.fetchInit({
					host: DOMAIN || host,
					origin: event.locals.origin
				})
				const storeId = storeOne?._id
				
				if (!storeId || storeId == 'undefined') {
					throw { status: 404, message: `Could not find STORE for domain = ${url.host}` }
				}

				event.cookies.set('storeId', storeId, { path: '/' })
				// event.cookies.set('store', JSON.stringify(store), { path: '/' })
				event.locals.storeId = storeId
				// event.locals.store = store
			} catch (e) {
				throw { status: 404, message: `Could not find STORE for domain = ${url.host}` }
			}
		}

		// This calls init only when store data not present in browser cookies
		// this simply gets data from cookie
		event.locals.me = await authenticateUser(event)
		const zip = event.cookies.get('zip')
		event.locals.sid = event.cookies.get('connect.sid')
		event.locals.cartId = event.cookies.get('cartId')
		if (zip) event.locals.zip = JSON.parse(zip)
		
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
		error(404, 'Store Not Found')
	}
}
