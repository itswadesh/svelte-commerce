import { services } from '@misiki/litekart-utils'

const isServer = import.meta.env.SSR

export async function load({ params, parent, url }) {
	let page = +url.searchParams.get('page') || 1
	let vendorSlug = params.slug
	const { store, storeId, sid, origin } = await parent()

	return {
		page,
		vendor: services.VendorService.fetchVendor({
			sid,
			slug: vendorSlug,
			storeId,
			origin
		}),
		vendorsProduct: services.VendorService.fetchProductsOfVendor({
			slug: vendorSlug,
			page: page,
			sid,
			origin,
			storeId
		})
	}
}
