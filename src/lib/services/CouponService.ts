import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI } from '$lib/utils/api'
import { getBigCommerceApi, getBySid, getWooCommerceApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchCoupons = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`coupons?store=${storeId}`, sid)
				} else {
					res = await getAPI(`coupons?store=${storeId}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`coupons`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`coupons`, {}, sid)
				break
		}
		return res?.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
