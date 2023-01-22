import type { Error } from '$lib/types'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const BigcommerceFetchProducts = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		if (server) {
			getBySid(`products?store=${storeId}`, sid)
		} else {
			res = await getAPI(`products?store=${storeId}`, origin)
		}
		return res?.data || []
	} catch (err) {
		console.log(err)
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}
