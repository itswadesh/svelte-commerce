import { VendorService } from '$lib/core/services'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch, params }) => {
	const slug = params.slug
	const vendorService = new VendorService(fetch)
	const vendor = await vendorService.get(slug)
	return { vendor }
}

