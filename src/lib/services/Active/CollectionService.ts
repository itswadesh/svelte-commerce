import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export const fetchCollections = async ({
	origin,
	query,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await getBySid(`collections?store=${storeId}`, sid)
		} else {
			res = await getAPI(`collections?store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		return {}
	}
}
