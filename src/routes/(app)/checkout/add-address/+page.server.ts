import { AddressService, CartService, CountryService } from '$lib/services'
import { loginUrl } from '$lib/config/index.js'
import { redirect } from '@sveltejs/kit'

export const prerender = false

export async function load({ cookies, locals, params, url }) {
	const { me, sid, store, storeId, origin } = locals
	const cartId = cookies.get('cartId')
	const id = url.searchParams.get('id')
	// const prescriptionId = url.searchParams.get('prescription')
	let address = {}
	let countries = []
	let states = []

	if (!me || !sid) {
		const redirectUrl = `${loginUrl}?ref=${url?.pathname}${url?.search || ''}`
		redirect(307, redirectUrl)
	}

	const cart = await CartService.fetchRefreshCart({
		cartId,
		origin,
		sid,
		storeId
	})

	// console.log('cart at add address', cart);

	if (!cart?.qty) {
		redirect(307, '/cart')
	}

	if (id === 'new') {
		address = { id: 'new', country: null, state: null }
	} else {
		address = await AddressService.fetchAddress({
			id,
			storeId,
			server: true,
			sid: cookies.get('connect.sid')
		})
	}

	countries = await CountryService.fetchCountries({
		storeId,
		server: true,
		sid: cookies.get('connect.sid')
	})

	if (countries?.length === 1) {
		address.country = countries[0].code || countries[0].iso_2
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
			storeId,
			server: true,
			sid: cookies.get('connect.sid'),
			countryCode: address?.country
		})
	}

	if (states?.length === 1) {
		address.state = states[0].code || states[0].iso_2
	}

	return { address, countries, states }
}
