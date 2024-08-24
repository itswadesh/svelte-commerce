import { shopifyInit } from '$lib/utils'
import { Shopify }  from '../shopify/utils'

export const fetchInit = async ({ host, origin }) => {
	try {

		const store = new Shopify();
		const storeData = store.initStore();

		return storeData
	} catch (error) {
		console.log('error', error)
	}
}
