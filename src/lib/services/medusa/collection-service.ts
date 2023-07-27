import { getMedusajsApi } from '$lib/utils/server'

export const fetchCollections = async ({
	origin,
	query,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`collections`)
		res.data = res.collections
		return res || {}
	} catch (e) {
		return {}
	}
}
