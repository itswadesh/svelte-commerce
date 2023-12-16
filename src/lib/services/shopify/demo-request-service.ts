import { getShopifyApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export const saveScheduleDemo = async ({
	storeId,
	schedule,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getShopifyApi(`customers/me`, {}, sid)

		return res
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
