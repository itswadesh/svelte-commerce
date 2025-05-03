import { VendorService } from '$lib/core/services'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch, url }) => {
	const currentPage = +(url.searchParams.get('page') || 1)
	const search = url.searchParams.get('search')
	const sort = url.searchParams.get('sort')

	const vendors = await VendorService.list({
		page: currentPage,
		sort: sort || '-createdAt'
	})
	return vendors
}

