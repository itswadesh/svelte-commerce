import { getBigcommerceApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export const savePopularSearch = async ({
	storeId,
	id,
	text,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getBigcommerceApi(`customers/me`)

		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
