import { gett } from '$lib/utils/server'
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
	const countries = { data: [{ code: 'IN', name: 'India' }] }
	const states = await gett('states?limit=300&page=0&countryCode=IN')

	if (address) {
		return { address, countries, states }
	}
	throw error(404, 'Address not found')
}
