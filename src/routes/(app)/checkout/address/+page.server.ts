import { AddressService, CartService, CountryService } from '$lib/services'
import { error, redirect } from '@sveltejs/kit'

export const prerender = false

export async function load({ locals, url, parent }) {
	const { me, sid, store, storeId, origin, cartId } = locals

	try {
		const currentPage = +url.searchParams.get('page') || 1
		const q = url.searchParams.get('q') || ''
		let err

		const cart = await CartService.fetchRefreshCart({
			cartId,
			origin,
			sid,
			storeId
		})

		// console.log('cart at address', cart);

		if (!cart?.qty) {
			redirect(307, '/cart')
		}

		const countries = await CountryService.fetchCountries({
			storeId,
			origin,
			sid
		})

		if (me) {
			const { myAddresses, selectedAddress } = await AddressService.fetchAddresses({
				storeId,
				origin,
				server: true,
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
				url: url.href
			}
		} else {
			return {
				cart,
				countries,
				currentPage,
				err,
				q,
				url: url.href
			}
		}
	} catch (e) {
		// console.log('errzzzzzzzzzzzzzzzzzz', e);
		if (e.status === 307 && e.location === '/cart') {
			redirect(307, '/cart')
		} else if (e.status === 401 || e.status === 307) {
			redirect(307, `/auth/login?ref=${url?.pathname}`)
		} else {
			error(500, e?.message)
		}
	}
}
