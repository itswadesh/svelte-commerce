import { CountryService } from '$lib/services'

export const prerender = false

export async function load({ cookies, locals, params, url }) {
	let countries = []

	countries = await CountryService.fetchCountries({
		storeId: locals.store?.id,
		server: true,
		sid: cookies.get('sid')
	})

	return { countries }
}
