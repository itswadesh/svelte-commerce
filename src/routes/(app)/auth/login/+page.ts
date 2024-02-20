import { services } from '@misiki/litekart-utils'

export const prerender = false

export async function load({ parent }) {
	const { store } = await parent()
	let countries = []

	// countries = await services.CountryService.fetchCountries({
	// 	storeId: store,
	// 	server: isServer,
	// 	origin
	// })

	return { countries }
}