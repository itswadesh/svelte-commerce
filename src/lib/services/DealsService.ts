import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI } from '$lib/utils/api'
import { getBigCommerceApi, getBySid, getMedusajsApi, getWooCommerceApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchDeals = async ({ origin, query, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`deals?store=${storeId}`, sid)
				} else {
					res = await getAPI(`deals?store=${storeId}`, origin)
				}
				break
			case 'medusajs':
				res = (await getMedusajsApi(`customers/me`, {}, sid)).customer.shipping_address
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`deals`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`deals`, {}, sid)
				break
		}
		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
