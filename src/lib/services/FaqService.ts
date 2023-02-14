import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBigCommerceApi, getBySid, getMedusajsApi, getWooCommerceApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import type { Error } from '$lib/types'
import { provider } from '$lib/config'

export const fetchFaqs = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`faqs?store${storeId}`, sid)
				} else {
					res = await getAPI(`faqs?store${storeId}`, origin)
				}
				break
			case 'medusajs':
				res = await getMedusajsApi(`customers/me`, {}, sid)
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`faqs`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`faqs`, {}, sid)
				break
		}
		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
