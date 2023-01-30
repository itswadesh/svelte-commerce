import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI } from '$lib/utils/api'
import { getBigCommerceApi, getBySid, getWooCommerceApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchVendor = async ({ origin, id, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`vendors/${id}`, sid)
				} else {
					res = await getAPI(`vendors/${id}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`vendors/${id}`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`vendors/${id}`, {}, sid)
				break
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
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`products?vendors=${id}&store=${storeId}`, sid)
				} else {
					res = await getAPI(`products?vendors=${id}&store=${storeId}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`products`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`products`, {}, sid)
				break
		}
		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
