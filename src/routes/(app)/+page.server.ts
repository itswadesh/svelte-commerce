import { DOMAIN, HTTP_ENDPOINT } from '$lib/config'
import { redis } from '$lib/server/redis'
import { fetchDeals } from '$lib/services/DealsService'
import { fetchHome } from '$lib/services/HomeService'
import { error } from '@sveltejs/kit'

export async function load({ locals, setHeaders }) {
	const { store, origin } = locals
	try {
		let home
		const cached = await redis.get('home-www')
		if (cached) {
			console.log('Cache hit!')
			home = JSON.parse(cached)
		}

		console.log('Cache miss!')
		home = await fetchHome({ storeId: store?.id, server: true })
		setHeaders({ 'cache-control': 'max-age: 600' })
		redis.set('home-www', JSON.stringify(home), 'EX', 600)
		const deals = await fetchDeals({ storeId: store?.id, server: true })
		if (home) {
			return { home: home, deals: deals || {} }
		}
	} catch (e) {
		throw error(
			404,
			`Store Not Found @Page 
			<br/>ID: ${store.id}
			<br/>ORIGIN: ${origin}
			<br/>DOMAIN(env):${DOMAIN}
			<br/>HTTP_ENDPOINT(env):${HTTP_ENDPOINT}`
		)
	}
}
