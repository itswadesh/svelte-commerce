import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'


export const fetchFooterCategories = async ({
	origin,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let data: []

		if (server) {
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

export const fetchCategory = async ({ origin, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await getBySid(`category/${id}`, sid)
		} else {
			res = await getAPI(`category/${id}`, origin)
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
	sid = null,
	featured = false
}: any) => {
	try {
		let res: any = {}
		let data, pageSize, currentPage

		let catQ = `categories?store=${storeId}`
		if (featured) {
			catQ += '&featured=true'
		}

		if (server) {
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

		let catQ = `categories?store=${storeId}`
		if (featured) {
			catQ += '&featured=true'
		}

		if (server) {
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

export const fetchMegamenuData = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let data: []

		if (server) {
			data = await getBySid(`categories/megamenu?megamenu=true&store=${storeId}`, sid)
		} else {
			data = await getAPI(`categories/megamenu?megamenu=true&store=${storeId}`, origin)
		}

		return data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
