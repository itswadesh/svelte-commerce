import { CountryService } from '$lib/services'

export const prerender = false
const isServer = import.meta.env.SSR

export async function load({ parent }) {
	const { store } = await parent()
	let countries = []

	countries = await CountryService.fetchCountries({
		storeId: store?.id,
		server: isServer,
		origin
	})

	return { countries }
}
