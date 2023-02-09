import { ASSETS, CACHE } from './constants'
export default (event: FetchEvent): void => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return

	async function respond() {
		const url = new URL(event.request.url)
		const cache = await caches.open(CACHE)

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			return cache.match(event.request)
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request)

			if (response.status === 200) {
				cache.put(event.request, response.clone())
			}

			return response
		} catch {
			return cache.match(event.request)
		}
	}

	event.respondWith(respond())
}
