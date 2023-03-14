import { error } from '@sveltejs/kit'
import { getWoocommerceApi } from '$lib/utils/server'
import type { Error } from '$lib/types'

export const fetchFaqs = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getWoocommerceApi(`customers/me`, {}, sid)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
