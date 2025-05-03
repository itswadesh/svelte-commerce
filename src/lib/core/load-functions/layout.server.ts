import { StoreService } from '$lib/core/services'
import type { LayoutServerLoad } from '../../../routes/$types'

export const load: LayoutServerLoad = async ({ locals, url, cookies, fetch, request }) => {
	let storeDetails = locals?.storeDetails
	if (!storeDetails) {
		const storeId = cookies.get('litekart_store_id')
		if (storeId) {
			const storeService = new StoreService(fetch)
			storeDetails = await storeService.getStoreByIdOrDomain({ storeId })
			if (storeDetails) {
				locals.storeDetails = storeDetails
			} else {
				throw new Error('Layout: Store not found..')
			}
		} else {
			throw new Error('Layout: Store not found.')
		}
	}
	return {
		store: storeDetails
	}
}

