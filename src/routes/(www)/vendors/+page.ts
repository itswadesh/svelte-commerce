import { VendorService } from '$lib/core/services'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch, url, parent }) => {
	// Vendor listings belong to the marketplace plugin; on a single-brand store there is no such page.
	const { store } = await parent()
	if (!store?.plugins?.isMultiVendor?.active) error(404, 'Page not found')

	const currentPage = +(url.searchParams.get('page') || 1)
	const search = url.searchParams.get('search')
	const sort = url.searchParams.get('sort')

	try {
		const vendorService = new VendorService(fetch)
		const vendors = await vendorService.list({
			page: currentPage,
			sort: sort || '-createdAt'
		})
		return { vendors }
	} catch (e) {
		console.error('Error loading vendors:', e)
		return { vendors: { data: [], count: 0 } }
	}
}
