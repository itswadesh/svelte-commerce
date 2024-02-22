import { VendorService } from '$lib/services'

const isServer = import.meta.env.SSR

export async function load({ params, parent, url }) {
	let page = +url.searchParams.get('page') || 1
	let vendorSlug = params.slug
	const { store, storeId, sid, origin } = await parent()

	return {
		page,
		vendor: VendorService.fetchVendor({
			sid,
			slug: vendorSlug,
			storeId,
			origin
		}),
		vendorsProduct: VendorService.fetchProductsOfVendor({
			slug: vendorSlug,
			page: page,
			sid,
			origin,
			storeId
		})
	}
}
