import { AddressService, CountryService } from '$lib/services'

export const prerender = false

export async function load({ cookies, locals, params, url }) {
	const { store } = locals
	const id = url.searchParams.get('id')
	// const prescriptionId = url.searchParams.get('prescription')
	let address = {}
	let countries = []
	let states = []

	if (id === 'new') {
		address = { id: 'new', country: null, state: null }
	} else {
		address = await AddressService.fetchAddress({
			id,
			storeId: store?.id,
			server: true,
			sid: cookies.get('connect.sid')
		})
	}

	countries = await CountryService.fetchCountries({
		storeId: store?.id,
		server: true,
		sid: cookies.get('connect.sid')
	})

	if (countries?.length === 1) {
		address.country = countries[0].code
	}

	// TODO: Find default country from the list and set default in dropdown

	if (address?.country) {
		states = await CountryService.fetchStates({
			storeId: store?.id,
			server: true,
			sid: cookies.get('connect.sid'),
			countryCode: address?.country
		})
	}

	if (states?.length === 1) {
		address.state = states[0].code
	}

	return { address, countries, states }
}
