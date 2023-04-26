import { getWoocommerceApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export const fetchPages = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getWoocommerceApi(`pages?store=${storeId}`)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchLatestPages = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getWoocommerceApi(`pages?sort=-updatedAt&limit=10&store=${storeId}`)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchPage = async ({ origin, id, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getWoocommerceApi(`pages/${id}`)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
