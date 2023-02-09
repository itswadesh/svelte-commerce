import { ASSETS, CACHE } from './constants'
import { build } from '$service-worker'
export default (event: ExtendableEvent): void => {
	// console.log('installing service worker')
	async function addFilesToCache() {
		const cache = await caches.open(CACHE)
		await cache.addAll(ASSETS)
	}

	event.waitUntil(addFilesToCache())
}
