import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'

export const fetchGallery = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await getBySid(`gallery?store=${storeId}`, sid)
		} else {
			res = await getAPI(`gallery?store=${storeId}`, origin)
		}

		return res.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
