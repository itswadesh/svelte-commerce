import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
const isServer = import.meta.env.SSR

export const fetchGallery = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`gallery?store=${storeId}`, sid)
		} else {
			res = await getAPI(`gallery?store=${storeId}`, origin)
		}

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
