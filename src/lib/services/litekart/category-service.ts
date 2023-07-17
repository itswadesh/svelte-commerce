import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'

const isServer = import.meta.env.SSR

export const fetchFooterCategories = async ({
	isCors = false,
	origin,
	megamenu = false,
	server = false,
	sid = null,
	storeId,
}) => {
	try {
		let data: []

		if (isServer || isCors) {
			data = await getBySid(`categories?megamenu=${megamenu}&limit=6&page=0&level=0&store=${storeId}`, sid)
		} else {
			data = await getAPI(
				`categories?megamenu=${megamenu}&limit=6&page=0&level=0&store=${storeId}`,
				origin
			)
		}

		return data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchCategory = async ({
	children = false,
	id,
	isCors = false,
	origin,
	server = false,
	sid = null,
	storeId
}) => {
	try {
		let res: any = {}

		if (isServer || isCors) {
			res = await getBySid(`es/categories/${id}?store=${storeId}&children=${children}`, sid)
		} else {
			res = await getAPI(`es/categories/${id}?store=${storeId}&children=${children}`, origin)
		}

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchAllCategories = async ({
	featured = false,
	isCors = false,
	origin,
	server = false,
	sid = null,
	storeId,
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
		currentPage = res.currentPage
		data = res.data
		pageSize = res.pageSize

		return { data, pageSize, currentPage }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchAllProductsOfCategories = async ({
	featured = false,
	isCors = false,
	origin,
	server = false,
	sid = null,
	storeId,
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
		// must return link:string, slug:string(optional) name:string, new:boolean
		currentPage = res?.page
		err = !products ? 'No result Not Found' : null
		facets = res?.facets?.all_aggs
		products = res?.data || []
		productsCount = res?.count

		return { products, productsCount, currentPage, facets, err }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchMegamenuData = async ({
	isCors = false,
	megamenu = false,
	origin,
	server = false,
	sid = null,
	storeId,
}) => {
	try {
		let data: []

		if (isServer || isCors) {
			data = await getBySid(`categories/megamenu?megamenu=${megamenu}&store=${storeId}`, sid)
		} else {
			data = await getAPI(`categories/megamenu?megamenu=${megamenu}&store=${storeId}`, origin)
		}

		return data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
