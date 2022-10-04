import { getAPI } from '$lib/util/api'
import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'

export async function load({ locals, params, parent, request }) {
	const { store } = locals
	const { id } = params
	let address
	if (id === 'new') {
		address = { id: 'new' }
	} else {
		address = await gett(`addresses/${id}`, request.headers.get('cookie'))
	}
	// const countries = await gett('countries', { store: store.id })
	const countries = { data: [{ code: 'IN', name: 'India' }] }
	const states = await gett('states?limit=300&page=0&countryCode=IN')

	if (address) {
		return { address, countries, states }
	}
	throw error(404, 'Address not found')
	// return {
	// 	status: 500,
	// 	errors: new Error('Internal Server Error')
	// }
}
