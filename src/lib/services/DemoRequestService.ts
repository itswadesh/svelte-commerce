import { provider } from '$lib/config'
import { getMedusajsApi, postBigCommerceApi, postWooCommerceApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
import type { Error } from '$lib/types'
import { post } from '$lib/utils/api'

export const saveScheduleDemo = async ({
	storeId,
	schedule,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await post(
					`saveScheduleDemo`,
					{
						schedule,
						store: storeId
					},
					origin
				)
				break
			case 'medusajs':
				res = (await getMedusajsApi(`customers/me`, {}, sid)).customer.shipping_address
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`saveScheduleDemo`, {})
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`saveScheduleDemo`, {})
				break
		}
		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
