import { AddressService, CountryService } from '$lib/services'

export const prerender = false

export async function load({ cookies, locals, params, url }) {
	const { store } = locals
	const { id } = params
	// const prescriptionId = url.searchParams.get('prescription')
	let address = {}
	let countries = []
	let states = []

	if (id === 'new') {
		address = { id: 'new', country: null, state: null }
	} else {
		address = await AddressService.fetchAddress({
			storeId: locals.store?.id,
			id,
			sid: cookies.get('connect.sid'),
			server: true
		})
	}

	countries = await CountryService.fetchCountries({
		storeId: locals.store?.id,
		server: true,
		sid: cookies.get('connect.sid')
	})

	if (countries?.length === 1) {
		address.country = countries[0].code
	}

	if (address?.country) {
		states = await CountryService.fetchStates({
			storeId: locals.store?.id,
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
