import { fetchAddress, fetchAddresses } from '$lib/services/AddressService'
import { error } from '@sveltejs/kit'

export async function load({ cookies, locals }) {
	const addresses = await fetchAddresses({storeId:locals.store?.id, server:true,sid:cookies.get('sid')})
	if (addresses) {
		return { addresses: addresses }
	}
	throw error(404, 'Addresses not found')
}
