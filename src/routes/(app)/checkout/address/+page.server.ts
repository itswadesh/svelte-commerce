import { AddressService, CartService, CountryService } from '$lib/services'
import { error, redirect } from '@sveltejs/kit'

export const prerender = false

export async function load({ request, url, locals, cookies }) {
	try {
		const currentPage = +url.searchParams.get('page') || 1
		const q = url.searchParams.get('q') || ''
		const sid = cookies.get('connect.sid')
		if (!sid) {
			throw { status: 401 }
		}
		let err

		const { myAddresses, selectedAddress } = await AddressService.fetchAddresses({
			storeId: locals.store?.id,
			origin: locals.origin,
			sid
		})

		const countries = await CountryService.fetchCountries({
			storeId: locals.store?.id,
			origin: locals.origin,
			sid
		})

		const cart = await CartService.fetchRefreshCart({
			cookies,
			storeId: locals.store?.id,
			origin: locals.origin,
			sid
		})

		return {
			cart,
			countries,
			currentPage,
			err,
			myAddresses,
			q,
			selectedAddress,
			url: url.href,
		}
	} catch (e) {
		if (e.status === 401 || e.status === 307) {
			throw redirect(307, `/auth/login?ref=${url?.pathname}`)
		} else {
			throw error(500, e?.message)
		}
	}
}
