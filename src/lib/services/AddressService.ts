import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI } from '$lib/utils/api'
import { getBigCommerceApi, getBySid, getWooCommerceApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchAddresses = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		let selectedAddress = {}
		let myAddresses = []
		switch (provider) {
			case 'litekart':
				if (server) {
					console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', `addresses/my?store=${storeId}`, sid)
					res = await getBySid(`addresses/my?store=${storeId}`, sid)
				} else {
					res = await getAPI(`addresses/my?store=${storeId}`, origin)
				}
				selectedAddress = res?.data[0]?._id
				myAddresses = res.data || []
				break
			case 'bigcommerce':
				myAddresses = await getBigCommerceApi(`addresses/my`, {}, sid)
				selectedAddress = myAddresses[0]?._id
				break
			case 'woocommerce':
				myAddresses = await getWooCommerceApi(`addresses/my`, {}, sid)
				selectedAddress = myAddresses[0]?._id
				break
		}
		return { myAddresses, selectedAddress }
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchAddress = async ({ origin, storeId, server = false, sid = null, id }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`addresses/${id}`, sid)
				} else {
					res = await getAPI(`addresses/${id}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`addresses/${id}`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`addresses/${id}`, {}, sid)
				break
		}
		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}
