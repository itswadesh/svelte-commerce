import { getMedusajsApi } from '$lib/utils/server'
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

		res = []

		return res
	} catch (e) {
		error(e.status, e.message)
	}
}
