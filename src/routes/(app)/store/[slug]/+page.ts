import { VendorService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, url }) {
	let page = +url.searchParams.get('page') || 1
	let vendorSlug = params.slug
	const { storeId, sid, origin } = await parent()
	let vendor
	let vendorsProduct
	const promises = [
		VendorService.fetchVendor({
			sid,
			slug: vendorSlug,
			storeId,
			origin: 'x'
		}),
		VendorService.fetchProductsOfVendor({
			slug: vendorSlug,
			page: page,
			sid,
			origin: 'x',
			storeId
		})
	]

	await Promise.allSettled(promises).then((results) => {
		const res1 = results[0]
		const res2 = results[1]
		if (res1.status === 'fulfilled') {
			vendor = res1.value
		} else {
			error(404, 'Vendor not found')
		}
		if (res2.status === 'fulfilled') {
			vendorsProduct = res2.value
		} else {
			console.error('Error fetching products:', res2.reason)
		}
	})
	return {
		page,
		vendor,
		vendorsProduct
	}
}
