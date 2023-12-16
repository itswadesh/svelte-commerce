import { getWoocommerceApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export const fetchFooterCategories = async ({
	origin,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let data: []

		data = await getWoocommerceApi(`customers/me`)

		return data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchCategory = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getWoocommerceApi(`product-categories/${id}`, {}, sid)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
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

		res = await getWoocommerceApi(`customers/me`, {}, sid)

		return { data, pageSize, currentPage }
	} catch (e) {
		error(e.status, e.data?.message || e.message)
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

		res = await getWoocommerceApi(`customers/me`, {}, sid)

		return { products, productsCount, currentPage, facets, err }
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchMegamenuData = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let data: []

		data = await getWoocommerceApi(`product-categories`, {}, sid)

		return data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
