import { AddressService, CartService, CountryService } from '$lib/services'
import { error, redirect } from '@sveltejs/kit'
import { loginUrl } from '$lib/config/index.js'

export const prerender = false

export async function load({ request, url, locals, cookies }) {
	const { me, sid, store, origin } = locals
	const cartId = cookies.get('cartId')

	if (!me || !sid) {
		const redirectUrl = `${loginUrl}?ref=${url?.pathname}${url?.search || ''}`
		throw redirect(307, redirectUrl)
	}

	try {
		const currentPage = +url.searchParams.get('page') || 1
		const q = url.searchParams.get('q') || ''
		let err

		const { myAddresses, selectedAddress } = await AddressService.fetchAddresses({
			storeId: store?.id,
			origin,
			sid
		})

		const countries = await CountryService.fetchCountries({
			storeId: store?.id,
			origin,
			sid
		})

		const cart = await CartService.fetchRefreshCart({
			cartId,
			storeId: store?.id,
			origin,
			sid
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
			url: url.href,
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
