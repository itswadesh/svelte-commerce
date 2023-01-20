import { fetchAddresses } from '$lib/services/AddressService'
import { fetchStates } from '$lib/services/CountryService'
import { error } from '@sveltejs/kit'

export async function load({ locals, params, parent, cookies }) {
	const { store } = locals
	const { id } = params
	let address
	if (id === 'new') {
		address = { id: 'new' }
	} else {
		address = await fetchAddresses({storeId:locals.store?.id, server:true,sid:cookies.get('sid')})
	}
	const countries = { data: [{ code: 'IN', name: 'India' }] }
	const states = await fetchStates({storeId:locals.store?.id, server:true,sid:cookies.get('sid'),countryCode:'IN'})

	if (address) {
		return { address, countries, states }
	}
	throw error(404, 'Address not found')
}
