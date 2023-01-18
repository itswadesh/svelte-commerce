import { gett } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export async function load({ params, request }) {
	const addresses = await gett(`addresses/my`, request.headers.get('cookie'))
	if (addresses) {
		return { addresses: addresses }
	}
	throw error(404, 'Addresses not found')
}
