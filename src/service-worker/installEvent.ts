import { CACHE_NAME } from './constants'
import { build } from '$service-worker'
export default (event: ExtendableEvent): void => {
	console.log('installing service worker')
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			// Open a cache and cache our files
			cache.addAll(build)
			return true
		})
	)
}
