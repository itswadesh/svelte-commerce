import { DOMAIN, HTTP_ENDPOINT } from '$lib/config'
// import { redis } from '$lib/server/redis'
import { DealsService, HomeService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ locals, setHeaders }) {
	// console.log('Store ID.............', locals.store?.id)

	const { store, origin } = locals

	let home = {}
	let deals = {}

	try {
		// const cached = await redis.get(`home-www-${locals.store?.id}`)
		// if (cached) {
		// 	console.log('Cache hit!')
		// 	home = JSON.parse(cached)
		// } else {
		// console.log('Cache miss!')
		home = await HomeService.fetchHome({ storeId: store?.id, server: true })
		// setHeaders({ 'cache-control': 'max-age: 600' })
		// redis.set(`home-www-${locals.store?.id}`, JSON.stringify(home), 'EX', 600)
		// }
		deals = await DealsService.fetchDeals({ storeId: store?.id, server: true })

		if (home) {
			return { home: home, deals: deals }
		}
	} catch (e) {
		throw error(
			404,
			`Store Not Found @Page 
			<br/>ID: ${store?.id}
			<br/>ORIGIN: ${origin}
			<br/>DOMAIN(env):${DOMAIN}
			<br/>HTTP_ENDPOINT(env):${HTTP_ENDPOINT}`
		)
	}
}
