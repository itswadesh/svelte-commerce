import { VerndorService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, url, locals, cookies }) {
	const { store } = await parent()
	let vendorSlug = params.slug
	let vendorId = url.searchParams.get('id')
	let page = +url.searchParams.get('page') || 1

	const vendor = await VerndorService.fetchVendor({
		server: true,
		sid: cookies.get('connect.sid'),
		slug: vendorSlug
	})

	const vendorsProduct = await VerndorService.fetchProductsOfVendor({
		id: vendorId,
		page: page,
		server: true,
		sid: cookies.get('connect.sid'),
		storeId: locals.store.id
	})

	if (vendor) {
		return {
			page,
			vendor,
			vendorsProduct
		}
	}

	throw error(404, 'User not found')
}
