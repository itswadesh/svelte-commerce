import { AddressService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ cookies, locals }) {
	const { myAddresses, selectedAddress, count } = await AddressService.fetchAddresses({
		storeId: locals.store?.id,
		server: true,
		sid: cookies.get('connect.sid')
	})

	myAddresses.count = count

	if (myAddresses) {
		return { addresses: myAddresses, selectedAddress }
	}

	throw error(404, 'Addresses not found')
}
