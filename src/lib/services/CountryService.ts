import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI } from '$lib/utils/api'
import { getBigCommerceApi, getBySid, getMedusajsApi, getWooCommerceApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchCountries = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`countries?limit=300&page=0&store=${storeId}`, sid)
				} else {
					res = await getAPI(`countries?limit=300&page=0&store=${storeId}`, origin)
				}
				break
			case 'medusajs':
				res = (await getMedusajsApi(`customers/me`, {}, sid)).customer.shipping_address
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`countries`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`countries`, {}, sid)
				break
		}
		return res?.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchStates = async ({
	origin,
	storeId,
	countryCode,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(
						`states?countryCode=${countryCode}&limit=300&page=0&sort=name&store=${storeId}`,
						sid
					)
				} else {
					res = await getAPI(
						`states?countryCode=${countryCode}&limit=300&page=0&sort=name&store=${storeId}`,
						origin
					)
				}
				break
			case 'medusajs':
				res = (await getMedusajsApi(`customers/me`, {}, sid)).customer.shipping_address
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`states`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`states`, {}, sid)
				break
		}
		return res?.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
