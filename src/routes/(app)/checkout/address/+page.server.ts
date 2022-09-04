import { getAPI } from '$lib/util/api'
import { error, redirect } from '@sveltejs/kit'
export const prerender = false

export async function load({ request, url }) {
	try {
		let err, myAddresses, selectedAddress
		myAddresses = await getAPI('addresses/my', request.headers)
		selectedAddress = myAddresses?.data[0]?._id
		let currentPage = +url.searchParams.get('page') || 1
		let q = url.searchParams.get('q') || ''

		const cart = await getAPI('carts/refresh-cart', request.headers)
		if (myAddresses?.data?.length) {
			return {
				cart,
				myAddresses,
				selectedAddress,
				url: url.href,
				currentPage,
				q,
				err
			}
		} else {
			return {
				cart,
				myAddresses: [],
				selectedAddress,
				url: url.href,
				currentPage,
				q,
				err
			}
		}
	} catch (e) {
		if (e.status === 401) {
			throw redirect(307, `/auth/otp-login?ref=${url?.pathname}`)
		} else {
			// return {
			// 	status: 500,
			// 	errors: new Error(e?.message)
			// }
			throw error(500, e?.message)
		}
	}
}
