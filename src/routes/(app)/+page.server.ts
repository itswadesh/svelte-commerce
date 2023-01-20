import { DOMAIN, HTTP_ENDPOINT } from '$lib/config'
import { fetchDeals } from '$lib/services/DealsService'
import { fetchHome } from '$lib/services/HomeService'
import { fetchProducts } from '$lib/services/ProductService'
import { error } from '@sveltejs/kit'

export async function load({  locals }) {
	const { store,origin } = locals
	try {
		const p = await fetchProducts({storeId:store?.id,server:true})
		console.log(p)
		const home = await fetchHome({storeId:store?.id,server:true})
		const deals = await fetchDeals({storeId:store?.id,server:true})
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
