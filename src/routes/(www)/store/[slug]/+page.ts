import { VendorService } from '$lib/core/services'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch, params, parent }) => {
	// Vendor storefronts belong to the marketplace plugin, as /vendors does.
	const { store } = await parent()
	if (!store?.plugins?.isMultiVendor?.active) error(404, 'Page not found')

	// An unknown slug is a missing page, not a server error.
	const vendor = await new VendorService(fetch).getVendor(params.slug).catch(() => null)
	if (!vendor) error(404, 'Page not found')
	return { vendor }
}
