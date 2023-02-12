import { fetchProductsOfVendor, fetchVendor } from '$lib/services/VerndorService'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, locals, cookies }) {
	const { store } = await parent()
	let vendorId = params.id

	const vendor = await fetchVendor({
		id: vendorId,
		storeId: locals.store.id,
		server: true,
		sid: cookies.get('connect.sid')
	})
	const vendorProducts = await fetchProductsOfVendor({
		id: vendorId,
		storeId: locals.store.id,
		server: true,
		sid: cookies.get('connect.sid')
	})

	if (vendor) {
		return { vendor, vendorProducts }
	}

	throw error(404, 'User not found')
}
