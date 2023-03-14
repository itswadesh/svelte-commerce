import { provider } from '$lib/config'
import { getBigcommerceApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
import type { Error } from '$lib/types'
import { post } from '$lib/utils/api'

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

		res = await getBigcommerceApi(`customers/me`, {}, sid)

		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
