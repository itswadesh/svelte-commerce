import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
const isServer = import.meta.env.SSR

export const fetchFooterCategories = async ({
	origin,
	storeId,
	server = false,
	isCors = false,
	sid = null
}) => {
	try {
		let data: []

		if (isServer || isCors) {
			data = await getBySid(`categories?megamenu=true&limit=6&page=0&level=0&store=${storeId}`, sid)
		} else {
			data = await getAPI(
				`categories?megamenu=true&limit=6&page=0&level=0&store=${storeId}`,
				origin
			)
		}

		return data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchCategory = async ({
	origin,
	id,
	server = false,
	children = false,
	isCors = false,
	sid = null,
	storeId
}) => {
	try {
		let res: any = {}

		if (isServer || isCors) {
			res = await getBySid(`es/categories/${id}?store=${storeId}&children=${children}`, sid)
		} else {
			res = await getAPI(`es/categories/${id}?store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchAllCategories = async ({
	origin,
	storeId,
	server = false,
	isCors = false,
	sid = null,
	featured = false
}) => {
	try {
		let res: any = {}
		let data, pageSize, currentPage

		let catQ = `categories?store=${storeId}`
		if (featured) {
			catQ += '&featured=true'
		}

		if (isServer || isCors) {
			res = await getBySid(catQ, sid)
		} else {
			res = await getAPI(catQ, origin)
		}
		data = res.data
		pageSize = res.pageSize
		currentPage = res.currentPage

		return { data, pageSize, currentPage }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchAllProductsOfCategories = async ({
	origin,
	storeId,
	server = false,
	isCors = false,
	sid = null,
	featured = false
}) => {
	try {
		let res: any = {}
		let products = []
		let productsCount = 0
		let currentPage = 0
		let facets = {}
		let err = null

		let catQ = `categories?store=${storeId}`
		if (featured) {
			catQ += '&featured=true'
		}

		if (isServer || isCors) {
			res = await getBySid(catQ, sid)
		} else {
			res = await getAPI(catQ, origin)
		}
		products = res?.data || []
		productsCount = res?.count
		currentPage = res?.page
		facets = res?.facets?.all_aggs
		err = !products ? 'No result Not Found' : null
		// must return link:string, slug:string(optional) name:string, new:boolean

		return { products, productsCount, currentPage, facets, err }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchMegamenuData = async ({
	origin,
	storeId,
	server = false,
	isCors = false,
	sid = null
}) => {
	try {
		let data: []

		if (isServer || isCors) {
			data = await getBySid(`categories/megamenu?megamenu=true&store=${storeId}`, sid)
		} else {
			data = await getAPI(`categories/megamenu?megamenu=true&store=${storeId}`, origin)
		}

		return data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
