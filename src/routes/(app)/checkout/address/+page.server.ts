import { AddressService, CartService } from '$lib/services'
import { error, redirect } from '@sveltejs/kit'

export const prerender = false

export async function load({ request, url, locals, cookies }) {
	try {
		let err

		const { myAddresses, selectedAddress } = await AddressService.fetchAddresses({
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('connect.sid')
		})

		const currentPage = +url.searchParams.get('page') || 1
		const q = url.searchParams.get('q') || ''

		const cart = await CartService.fetchRefreshCart({
			storeId: locals.store?.id,
			cookies
		})

		return {
			cart,
			myAddresses,
			selectedAddress,
			url: url.href,
			currentPage,
			q,
			err
		}
	} catch (e) {
		if (e.status === 401 || e.status === 307) {
			throw redirect(307, `/auth/login?ref=${url?.pathname}`)
		} else {
			throw error(500, e?.message)
		}
	}
}
