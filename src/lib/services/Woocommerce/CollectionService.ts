import { getWoocommerceApi } from '$lib/utils/server'

export const fetchCollections = async ({
	origin,
	query,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getWoocommerceApi(`collections?store=${storeId}`)

		return res || {}
	} catch (e) {
		return {}
	}
}
