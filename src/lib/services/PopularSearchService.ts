import { provider } from '$lib/config'
import { getMedusajsApi, postBigCommerceApi, postWooCommerceApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
import type { Error } from '$lib/types'
import { post } from '$lib/utils/api'

export const savePopularSearch = async ({
	storeId,
	id,
	text,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await post(
					`popular-search`,
					{
						id,
						text,
						// popularity: 0,
						store: storeId
					},
					origin
				)
				break
			case 'medusajs':
				res = (await getMedusajsApi(`customers/me`, {}, sid)).customer.shipping_address
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`popular-search`, {})
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`popular-search`, {})
				break
		}
		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
