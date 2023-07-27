import type { Error } from '$lib/types'
//import { mapBigcommerceCategory } from '$lib/utils'
import { getAPI } from '$lib/utils/api'
import { getBySid, getBigcommerceApi, getWoocommerceApi } from '$lib/utils/server'
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

		data = await getBigcommerceApi(`customers/me`, {}, sid)

		return data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchCategory = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getBigcommerceApi(`product-categories/${id}`, {}, sid)

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchAllCategories = async ({
	origin,
	storeId,
	server = false,
	sid = null,
	featured = false
}: any) => {
	try {
		let res: any = {}
		let data, pageSize, currentPage

		res = await getBigcommerceApi(`customers/me`, {}, sid)

		return { data, pageSize, currentPage }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchAllProductsOfCategories = async ({
	origin,
	storeId,
	server = false,
	sid = null,
	featured = false
}: any) => {
	try {
		let res: any = {}
		let products = []
		let productsCount = 0
		let currentPage = 0
		let facets = {}
		let err = null

		res = await getBigcommerceApi(`customers/me`, {}, sid)

		return { products, productsCount, currentPage, facets, err }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchMegamenuData = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let data: []

		data = await getBigcommerceApi(`product-categories`, {}, sid)

		return data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
