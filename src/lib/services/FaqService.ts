import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBigCommerceApi, getBySid, getWooCommerceApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import type { Error } from '$lib/types'
import { provider } from '$lib/config'

export const fetchFaqs = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`faq?store${storeId}`, sid)
				} else {
					res = await getAPI(`faq?store${storeId}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`faq`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`faq`, {}, sid)
				break
		}
		return res.data || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}
