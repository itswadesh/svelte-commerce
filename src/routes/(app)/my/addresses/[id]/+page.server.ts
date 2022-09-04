import { getAPI } from '$lib/util/api'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, request }) {
	const { store } = await parent()
	const { id } = params
	let address
	if (params.id === 'new') {
		address = { id: 'new' }
	} else {
		address = await getAPI(`addresses/${id}`, request.headers)
	}
	const countries = await getAPI('countries', { store: store?.id })
	const states = await getAPI('states', {
		limit: 300,
		page: 0,
		countryCode: address?.country
	})

	if (address) {
		return { address, countries, states }
	}
	throw error(404, 'Address not found')
	// return {
	// 	status: 500,
	// 	errors: new Error('Internal Server Error')
	// }
}
