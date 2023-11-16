import { AddressService, CartService, CountryService } from '$lib/services'
import { error, redirect } from '@sveltejs/kit'

export const prerender = false

export async function load({ url, parent }) {
	const { me, sid, store, storeId, origin, cartId } = await parent()

	if (!me || !sid) {
		const redirectUrl = `/auth/login?ref=${url?.pathname}${url?.search || ''}`
		throw redirect(307, redirectUrl)
	}

	try {
		const currentPage = +url.searchParams.get('page') || 1
		const q = url.searchParams.get('q') || ''
		let err

		const { myAddresses, selectedAddress } = await AddressService.fetchAddresses({
			storeId,
			origin,
			sid
		})

		const countries = await CountryService.fetchCountries({
			storeId,
			origin,
			sid
		})

		const cart = await CartService.fetchRefreshCart({
			cartId,
			origin,
			sid,
			storeId
		})

		// console.log('cart at address', cart);

		if (!cart?.qty) {
			throw redirect(307, '/cart')
		}

		return {
			cart,
			countries,
			currentPage,
			err,
			myAddresses,
			q,
			selectedAddress,
			url: url.href
		}
	} catch (e) {
		if (e.status === 307 && e.location === '/cart') {
			throw redirect(307, '/cart')
		} else if (e.status === 401 || e.status === 307) {
			throw redirect(307, `/auth/login?ref=${url?.pathname}`)
		} else {
			throw error(500, e?.message)
		}
	}
}
