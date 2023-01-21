import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI } from '$lib/utils/api'
import { getBigCommerceApi, getBySid, getWooCommerceApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchOrders = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`orders/my?store=${storeId}&active=true`, sid)
				} else {
					res = await getAPI(`orders/my?store=${storeId}&active=true`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`orders/my`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`orders/my`, {}, sid)
				break
		}
		return res.data || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchOrder = async ({ origin, storeId, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`orders/${id}?store=${storeId}`, sid)
				} else {
					res = await getAPI(`orders/${id}?store=${storeId}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`orders/${id}`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`orders/${id}`, {}, sid)
				break
		}
		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchTrackOrder = async ({ origin, storeId, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`order-tracking?order=${id}&store=${storeId}`, sid)
				} else {
					res = await getAPI(`order-tracking?order=${id}&store=${storeId}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`order-tracking`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`order-tracking`, {}, sid)
				break
		}
		return res.data || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}
