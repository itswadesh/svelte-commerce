import { error } from '@sveltejs/kit'
import { getAPI, post } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
const isServer = import.meta.env.SSR

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

		res = await post(
			`popular-search`,
			{
				id,
				text,
				// popularity: 0,
				store: storeId
			},
			origin
		)

		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchPopularSearch = async ({ origin, storeId, sid = null, isCors = false }) => {
	try {
		let res: any = {}
		if (isServer || isCors) {
			res = await getBySid(`popular-search?store=${storeId}&active=true`, sid)
		} else {
			res = await getAPI(`popular-search?store=${storeId}&active=true`, origin)
		}

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
