import { getMedusajsApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
import { mapMedusajsCategory } from './medusa-utils'

export const fetchFooterCategories = async ({
	origin,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let data: []

		data = await getMedusajsApi(`product-categories`)

		return data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchCategory = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		// res = await getMedusajsApi(`product-categories?handle=${id}`)

		// let cat_data: any = {}

		const cat_data = (await getMedusajsApi(`product-categories?handle=${id}`)).product_categories

		res = cat_data.map((category: any) => {
			return mapMedusajsCategory(category)
		})

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

		res = await getMedusajsApi(`product-categories`)

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

		res = await getMedusajsApi(`product-categories`)

		return { products, productsCount, currentPage, facets, err }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchMegamenuData = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let cat_data: []

		cat_data = (await getMedusajsApi(`product-categories`)).product_categories

		const data = cat_data.map((category: any) => {
			return mapMedusajsCategory(category)
		})

		return data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
