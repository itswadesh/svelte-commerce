import { VerndorService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, locals, cookies }) {
	const { store } = await parent()
	let vendorId = params.id

	const vendor = await VerndorService.fetchVendor({
		id: vendorId,
		storeId: locals.store.id,
		server: true,
		sid: cookies.get('connect.sid')
	})
	const vendorProducts = await VerndorService.fetchProductsOfVendor({
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
