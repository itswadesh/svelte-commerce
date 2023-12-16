import { error } from '@sveltejs/kit'
import { getWoocommerceApi } from '$lib/utils/server'

export const fetchGallery = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getWoocommerceApi(`gallery?store=${storeId}`)

		return res.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message);
	}
}
