import type { Error } from '$lib/types'
import { getAPI } from '$lib/utils/api'
import { getBySid, gett } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const searchProducts = async ({
	origin,
	query,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		if (server) {
			res = await getBySid(`es/products?${query}&store=${storeId}`, sid)
		} else {
			res = await getAPI(`es/products?${query}&store=${storeId}`, origin)
		}
		res = res || []
		let products = []
		products = res.data.map((p) => {
			let p1
			p1 = { ...p._source }
			p1.id = p._id
			return p1
		})
		const count = res?.count
		const facets = res?.facets
		const pageSize = res?.pageSize
		const err = !res?.estimatedTotalHits ? 'No result Not Found' : null
		return { products, count, facets, pageSize, err }
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchProduct = async ({ origin, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		if (server) {
			res = await getBySid(`products/${id}`, sid)
		} else {
			res = await getAPI(`products/${id}`, origin)
		}
		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchProducts = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		if (server) {
			res = await getBySid(`products?store=${storeId}`, sid)
		} else {
			res = await getAPI(`products?store=${storeId}`, origin)
		}
		return res?.data || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchProductsOfCategory = async ({
	origin,
	storeId,
	query,
	categorySlug,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		if (server) {
			res = await getBySid(`es/products?categories=${categorySlug}&store=${storeId}&${query}`, sid)
		} else {
			res = await getAPI(`es/products?categories=${categorySlug}&store=${storeId}&${query}`, origin)
		}
		const products = res?.data?.map((p) => {
			const p1 = { ...p._source }
			p1.id = p._id
			return p1
		})
		const count = res?.count
		const facets = res?.facets
		const pageSize = res?.pageSize
		const category = res?.category
		const err = !res?.estimatedTotalHits ? 'No result Not Found' : null
		return { products, count, facets, pageSize, category, err }
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchNextPageProducts = async ({
	origin,
	storeId,
	categorySlug,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		if (server) {
			res = await getBySid(`es/products?categories=${categorySlug}&store=${storeId}`, sid)
		} else {
			res = await getAPI(`es/products?categories=${categorySlug}&store=${storeId}`, origin)
		}
		const nextPageData = res?.data?.map((p) => {
			const p1 = { ...p._source }
			p1.id = p._id
			return p1
		})
		return nextPageData || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchRelatedProducts = async ({
	origin,
	storeId,
	categorySlug,
	pid,
	server = false,
	sid = null
}: any) => {
	try {
		let relatedProductsRes: any = {}

		if (server) {
			relatedProductsRes = await getBySid(
				`es/products?categories=${categorySlug}&store=${storeId}`,
				sid
			)
		} else {
			relatedProductsRes = await getAPI(
				`es/products?categories=${categorySlug}&store=${storeId}`,
				origin
			)
		}

		const relatedProducts = relatedProductsRes?.data.filter((p) => {
			return p._id !== pid
		})

		return relatedProducts || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}
