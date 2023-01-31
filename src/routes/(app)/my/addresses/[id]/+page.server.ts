import { error } from '@sveltejs/kit'
import { fetchAddress } from '$lib/services/AddressService'
import { fetchStates } from '$lib/services/CountryService'

export async function load({ locals, params, parent, cookies }) {
	const { store } = locals
	const { id } = params
	let address

	if (id === 'new') {
		address = { id: 'new' }
	} else {
		address = await fetchAddress({
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('sid'),
			id
		})
	}

	const countries = { data: [{ code: 'IN', name: 'India' }] }

	const states = await fetchStates({
		storeId: locals.store?.id,
		server: true,
		sid: cookies.get('sid'),
		countryCode: 'IN'
	})

	if (address) {
		return { address, countries, states }
	}

	throw error(404, 'Address not found')
}
