import { getAPI } from '$lib/util/api'
import { error } from '@sveltejs/kit'

export async function load({ params, request }) {
	const addresses = await getAPI(`addresses/my`, request.headers)

	if (addresses) {
		return { addresses: addresses.data }
	}
	throw error(404, 'Addresses not found')
	// return {
	// 	status: 500,
	// 	errors: new Error('Internal Server Error')
	// }
}
