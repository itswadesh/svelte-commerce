import { fetchAddress } from '$lib/services/AddressService'
import { fetchCountries, fetchStates } from '$lib/services/CountryService'

export const prerender = false

export async function load({ url, cookies, locals }) {
	let ads = {}
	const id = url.searchParams.get('id')
	const prescriptionId = url.searchParams.get('prescription')

	if (id === 'new') {
		ads = { id: 'new' }
	} else {
		ads = await fetchAddress({
			storeId: locals.store?.id,
			id,
			sid: cookies.get('connect.sid'),
			server: true
		})
	}

	const countries = await fetchCountries({
		storeId: locals.store?.id,
		server: true,
		sid: cookies.get('connect.sid')
	})

	const states = await fetchStates({
		storeId: locals.store?.id,
		server: true,
		sid: cookies.get('connect.sid'),
		countryCode: 'IN'
	})

	return { ads, countries, states }
}
