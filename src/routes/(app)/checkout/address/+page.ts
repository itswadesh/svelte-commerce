import { error, redirect } from '@sveltejs/kit'
import { AddressService, CartService, CountryService } from '$lib/services'

export const prerender = false

export async function load({ url, parent }) {
	const { me, sid, store, storeId, origin, cartId } = await parent()

	try {
		const currentPage = +url.searchParams.get('page') || 1
		const q = url.searchParams.get('q') || ''
		let err

		const [cart, countries] = await Promise.all([
			CartService.fetchRefreshCart({
				cartId,
				origin,
				sid,
				storeId
			}),
			CountryService.fetchCountries({
				storeId,
				origin,
				sid
			})
		])

		if (!cart?.qty) {
			redirect(307, '/cart')
		}

		if (store?.isGuestCheckout) {
			if (me) {
				const { myAddresses, preSelectedAddress } = await AddressService.fetchAddresses({
					storeId,
					origin,
					sid
				})

				return {
					cart,
					countries,
					currentPage,
					err,
					myAddresses,
					q,
					preSelectedAddress,
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
		} else {
			if (!me) {
				redirect(307, `/auth/login?ref=${url?.pathname}`)
			} else {
				const { myAddresses, preSelectedAddress } = await AddressService.fetchAddresses({
					storeId,
					origin,
					sid
				})

				return {
					cart,
					countries,
					currentPage,
					err,
					myAddresses,
					q,
					preSelectedAddress,
					url: url.href
				}
			}
		}
	} catch (e) {
		if (e.status === 307 && e.location === '/cart') {
			redirect(307, '/cart')
		} else if (e.status === 401 || e.status === 307) {
			redirect(307, `/auth/login?ref=${url?.pathname}`)
		} else {
			error(500, e?.message)
		}
	}
}
