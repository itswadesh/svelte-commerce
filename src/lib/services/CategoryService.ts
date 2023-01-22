import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI } from '$lib/utils/api'
import { getBigCommerceApi, getBySid, getWooCommerceApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchFooterCategories = async ({
	origin,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let data: []
		switch (provider) {
			case 'litekart':
				if (server) {
					data = await getBySid(
						`categories?store=${storeId}&megamenu=true&limit=6&page=0&level=0`,
						sid
					)
				} else {
					data = await getAPI(
						`categories?store=${storeId}&megamenu=true&limit=6&page=0&level=0`,
						origin
					)
				}
				// must return link:string, slug:string(optional) name:string, new:boolean
				break
			case 'bigcommerce':
				data = await getBigCommerceApi(`categories`, {}, sid)
				break
			case 'woocommerce':
				data = await getWooCommerceApi(`categories`, {}, sid)
				break
		}
		return data || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchCategory = async ({ origin, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`category/${id}`, sid)
				} else {
					res = await getAPI(`category/${id}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`categories`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`categories`, {}, sid)
				break
		}
		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchAllCategories = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		let products = []
		let productsCount = 0
		let currentPage = 0
		let facets = {}
		let err = null
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`categories?store=${storeId}`, sid)
				} else {
					res = await getAPI(`categories?store=${storeId}`, origin)
				}
				products = res?.data || []
				productsCount = res?.count
				currentPage = res?.page
				facets = res?.facets?.all_aggs
				err = !products ? 'No result Not Found' : null
				// must return link:string, slug:string(optional) name:string, new:boolean
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`categories`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`categories`, {}, sid)
				break
		}
		return { products, productsCount, currentPage, facets, err }
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchMegamenuData = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let data: []
		switch (provider) {
			case 'litekart':
				if (server) {
					data = await getBySid(`categories/megamenu?megamenu=true&store=${storeId}`, sid)
				} else {
					data = await getAPI(`categories/megamenu?megamenu=true&store=${storeId}`, origin)
				}
				// must return link:string, slug:string(optional) name:string, new:boolean
				break
			case 'bigcommerce':
				data = await getBigCommerceApi(`banners`, {}, sid)
				break
			case 'woocommerce':
				data = await getWooCommerceApi(`banners`, {}, sid)
				break
		}
		return data || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}
