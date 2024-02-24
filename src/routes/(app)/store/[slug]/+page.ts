import { VendorService } from '$lib/services'

const isServer = import.meta.env.SSR

export async function load({ params, parent, url }) {
	let page = +url.searchParams.get('page') || 1
	let vendorSlug = params.slug
	const { store, storeId, sid, origin } = await parent()
	let vendor
	let vendorsProduct
	try {
		vendor = await VendorService.fetchVendor({
			sid,
			slug: vendorSlug,
			storeId,
			origin
		})
	} catch (e) {}
	try {
		vendorsProduct = await VendorService.fetchProductsOfVendor({
			slug: vendorSlug,
			page: page,
			sid,
			origin,
			storeId
		})
	} catch (e) {}
	return {
		page,
		vendor,
		vendorsProduct
	}
}
