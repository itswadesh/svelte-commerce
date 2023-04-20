import { VerndorService } from '$lib/services'
const isServer = import.meta.env.SSR

export async function load({ params, parent, url }) {
	let page = +url.searchParams.get('page') || 1
	let vendorSlug = params.slug
	const { store, sid, origin } = await parent()
	return {
		page,
		vendor: VerndorService.fetchVendor({
			server: isServer,
			sid,
			slug: vendorSlug,
			storeId: store?.id,
			origin
		}),
		vendorsProduct: VerndorService.fetchProductsOfVendor({
			slug: vendorSlug,
			page: page,
			server: isServer,
			sid,
			origin,
			storeId: store?.id
		})
	}
}
