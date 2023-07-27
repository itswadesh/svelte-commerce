import { getMedusajsApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

// TODO: MedusaJS dont support pages in this current version

export const fetchPages = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = {} //await getMedusajsApi(`pages?store=${storeId}`)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchLatestPages = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = {}//await getMedusajsApi(`pages?sort=-updatedAt&limit=10&store=${storeId}`)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchPage = async ({ origin, id, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = {} //await getMedusajsApi(`pages/${id}`)

		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
