import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'

const isServer = import.meta.env.SSR

export const fetchMenuData = async ({ isCors = false, origin, sid = null, storeId }) => {
	try {
		let data: []

		if (isServer || isCors) {
			data = await getBySid(`menus?active=true&store=${storeId}`, sid)
		} else {
			data = await getAPI(`menus?active=true&store=${storeId}`, origin)
		}

		return data.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
