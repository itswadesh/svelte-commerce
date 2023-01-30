import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI } from '$lib/utils/api'
import { getBigCommerceApi, getBySid, getWooCommerceApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchBlogs = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`blogs?store${storeId}`, sid)
				} else {
					res = await getAPI(`blogs?store${storeId}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`blogs`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`blogs`, {}, sid)
				break
		}
		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchLatestBlogs = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`blogs?sort=-updatedAt&limit=10&store=${storeId}`, sid)
				} else {
					res = await getAPI(`blogs?sort=-updatedAt&limit=10&store=${storeId}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`blogs?sort=-updatedAt&limit=10`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`blogs?sort=-updatedAt&limit=10`, {}, sid)
				break
		}
		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchBlog = async ({ origin, id, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`blogs/${id}`, sid)
				} else {
					res = await getAPI(`blogs/${id}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`blogs/${id}`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`blogs/${id}`, {}, sid)
				break
		}
		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
