import { CountryService } from '$lib/services'

export const prerender = false

export async function load({ parent }) {
	const { store } = await parent()
	let countries = []

	// countries = await CountryService.fetchCountries({
	// 	storeId: store?.id,
	// 	server: isServer,
	// 	origin
	// })

	return { countries }
}
