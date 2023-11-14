const IS_DEV = import.meta.env.DEV
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
		address = {
			id: 'new',
			country: null,
			state: null
		}
		if (IS_DEV) {
			address = {
				id: 'new',
				state: null,
				firstName: 'Test Name',
				lastName: 'Test Last Name',
				email: 'test@litekart.in',
				phone: '8888888888',
				address: 'fake address',
				country: 'IN',
				zip: '77777'
			}
		}
	} else {
		address = await AddressService.fetchAddress({
			storeId: locals.storeId,
			id,
			sid: cookies.get('connect.sid'),
			server: true
		})
	}

	countries = await CountryService.fetchCountries({
		storeId: locals.storeId,
		server: true,
		sid: cookies.get('connect.sid')
	})

	if (countries?.length === 1) {
		address.country = countries[0].code
	} else if (countries?.length > 1) {
		const dafaultCountry = countries.filter((c) => {
			return c.dafault
		})

		// console.log('dafaultCountry', dafaultCountry);

		if (dafaultCountry[0]) {
			address.country = dafaultCountry[0].code
		}
	}

	if (address?.country) {
		states = await CountryService.fetchStates({
			storeId: locals.storeId,
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
