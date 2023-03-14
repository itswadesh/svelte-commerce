import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export const fetchVendor = async ({ origin, id, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await getBySid(`vendors/${id}`, sid)
		} else {
			res = await getAPI(`vendors/${id}`, origin)
		}

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchProductsOfVendor = async ({
	origin,
	id,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await getBySid(`products?vendors=${id}&store=${storeId}`, sid)
		} else {
			res = await getAPI(`products?vendors=${id}&store=${storeId}`, origin)
		}

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
