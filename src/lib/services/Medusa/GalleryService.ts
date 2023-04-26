import { error } from '@sveltejs/kit'
import { getBySid, getMedusajsApi } from '$lib/utils/server'

export const fetchGallery = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`gallery`)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
