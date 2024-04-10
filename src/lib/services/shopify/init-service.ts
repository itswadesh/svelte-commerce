import { shopifyInit } from '$lib/utils'

export const fetchInit = async ({host, origin}) => {
	try {
		const store = await shopifyInit({
			query: `{
      shop {
		id
		name
		description
	  }
  }`,
			variables: {}
		})
		return { storeOne: {
			_id: store?.shop?.id,
			title: store?.shop?.name,
			description: store?.data?.description,
		} }
	} catch (error) {
		console.log('error', error)
	}

	// return { storeOne: { _id: 'Shopify' } }
}
