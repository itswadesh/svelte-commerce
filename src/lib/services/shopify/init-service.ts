import { shopifyInit } from '$lib/utils'
import { Shopify }  from '../shopify/utils'

export const fetchInit = async ({ host, origin }) => {
	try {
		const response = await shopifyInit({
			query: `{
      shop {
		id
		name
		description
	  }
  }`,
			variables: {}
		})

		const store = new Shopify();
		const storeData = store.initStore(response);

		return storeData
	} catch (error) {
		console.log('error', error)
	}

	// return { storeOne: { _id: 'Shopify' } }
}
