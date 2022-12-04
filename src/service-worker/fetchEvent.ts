import { CACHE_NAME } from './constants'
export default (event: FetchEvent): void => {
	event.respondWith(
		caches.match(event.request).then((cacheResponse) => {
			if (cacheResponse) {
				// console.info(`fetching from cache: ${event.request.url}`)
				return cacheResponse
			}
			// console.info(`trying to fetch from server: ${event.request.url}`)
			return fetch(event.request)
				.then(async (fetchResponse): Promise<Response | undefined> => {
					if (event.request.url.indexOf('http') !== -1) {
						const cache = await caches.open(CACHE_NAME)
						try {
							const url = event.request.url
							// event.request.headers.forEach((value, key, parent) => {
							// 	console.log('zzzzzzzzzzzzzzzzzz', event.request.url, key, value)
							// })
							// console.log('To check images', event.request.headers.get('accept'))
							if (
								url.includes('/_app/immutable/') ||
								url.includes('https://www.googletagmanager.com/gtag/') ||
								url.includes('https://www.google-analytics.com/g/collect') ||
								url.includes('https://fonts.googleapis.com/') ||
								url.includes('https://fonts.gstatic.com/s/') ||
								url.includes('.png') ||
								url.includes('.jpg') ||
								url.includes('.jpeg') ||
								url.includes('.webp')
							) {
								cache.put(event.request.url, fetchResponse.clone())
							}
							// filter what to add to the cache
							// if (fetchResponse.status !== 206) {

							// if (!event.request.url.includes(`/server/`)) {
							// if (
							// 	event.request.headers.get('cache') !== 'no-cache' &&
							// 	!event.request.url.includes('.json') &&
							// 	!event.request.url.includes(`/server/`)
							// ) {
							// 	console.log(
							// 		'Added to cache...',
							// 		event.request.url,
							// 		!event.request.url.includes('.json'),
							// 		!event.request.url.includes(`/server/`),
							// 		event.request.headers.get('cache')
							// 	)
							// 	cache.put(event.request.url, fetchResponse.clone())
							// } else {
							// 	console.log(
							// 		'Must not cache...',
							// 		event.request.url,
							// 		!event.request.url.includes('.json'),
							// 		!event.request.url.includes(`/server/`),
							// 		event.request.headers.get('cache')
							// 	)
							// }
						} catch (error) {
							// console.error(error)
						}
						return fetchResponse
					}
					// eslint-disable-next-line consistent-return
					return undefined
				})
				.catch((error) => {
					// console.error(`"${error}: ${event.request.url}`)
					return error
				})
		})
	)
}
