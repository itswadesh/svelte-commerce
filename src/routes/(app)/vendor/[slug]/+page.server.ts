import { VerndorService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ cookies, locals, params, parent, url }) {
	let page = +url.searchParams.get('page') || 1
	let vendor = {}
	let vendorSlug = params.slug
	let vendorsProduct = {}

	vendor = await VerndorService.fetchVendor({
		server: true,
		sid: cookies.get('connect.sid'),
		slug: vendorSlug
	})

	if (vendor._id) {
		vendorsProduct = await VerndorService.fetchProductsOfVendor({
			id: vendor._id,
			page: page,
			server: true,
			sid: cookies.get('connect.sid'),
			storeId: locals.store.id
		})
	}

	if (vendor) {
		return {
			page,
			vendor,
			vendorsProduct
		}
	}

	throw error(404, 'User not found')
}
