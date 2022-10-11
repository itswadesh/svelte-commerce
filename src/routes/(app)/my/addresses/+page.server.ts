import { getAPI } from '$lib/util/api'
import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'

export async function load({ params, request }) {
	const addresses = await gett(`addresses/my`, request.headers.get('cookie'))
	if (addresses) {
		return { addresses: addresses }
	}
	throw error(404, 'Addresses not found')
	// return {
	// 	status: 500,
	// 	errors: new Error('Internal Server Error')
	// }
}
