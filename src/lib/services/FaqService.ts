import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import type { Error } from '$lib/types'

export const fetchFaqs = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		if (server) {
			res = await getBySid(`faq?store${storeId}`, sid)
		} else {
			res = await getAPI(`faq?store${storeId}`, origin)
		}
		return res.data || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}
