import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI } from '$lib/utils/api'
import { getBigCommerceApi, getBySid, getMedusajsApi, getWooCommerceApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchHome = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`home?store=${storeId}`, sid)
				} else {
					res = await getAPI(`home?store=${storeId}`, origin)
				}
				break
			case 'medusajs':
				res = await getMedusajsApi(`products`, {}, sid)
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`home`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`home`, {}, sid)
				break
		}
		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
