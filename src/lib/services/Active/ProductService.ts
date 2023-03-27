import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import type { AllProducts, Error, Product } from '$lib/types'

// Search product

export const searchProducts = async ({
	origin,
	query,
	searchData,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: AllProducts | {} = {}
		let products: Product[] = []
		let count = 0
		let facets = ''
		let pageSize = 0
		let category = ''
		let err = ''

		if (server) {
			res = await getBySid(`es/products?${query}&store=${storeId}`, sid)
		} else {
			res = await getAPI(`es/products?${query}&store=${storeId}`, origin)
		}
		res = res || {}
		products = res.data.map((p) => {
			const p1 = { ...p._source }
			p1.id = p._id
			return p1
		})
		count = res?.count
		facets = res?.facets
		pageSize = res?.pageSize
		err = !res?.estimatedTotalHits ? 'No result Not Found' : null

		return { products, count, facets, pageSize, err }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch all products

export const fetchProducts = async ({
	origin,
	storeId,
	slug,
	id,
	server = false,
	sid = null
}: any) => {
	try {
		let res: AllProducts | {} = {}

		if (server) {
			res = await getBySid(`products?store=${storeId}`, sid)
		} else {
			res = await getAPI(`products?store=${storeId}`, origin)
		}

		return res?.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch single product

export const fetchProduct = async ({
	origin,
	slug,
	id,
	server = false,
	sid = null,
	storeId
}: any) => {
	try {
		let res: Product | {} = {}

		if (server) {
			res = await getBySid(`es/products/${slug || id}`, sid)
		} else {
			res = await getAPI(`es/products/${slug || id}`, origin)
		}

		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch products based on category

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
		let products: Product[] = []
		let count = 0
		let facets = ''
		let pageSize = 0
		let category = ''
		let err = ''

		if (server) {
			res = await getBySid(`es/products?categories=${categorySlug}&store=${storeId}&${query}`, sid)
		} else {
			res = await getAPI(`es/products?categories=${categorySlug}&store=${storeId}&${query}`, origin)
		}
		products = res?.data?.map((p) => {
			const p1 = { ...p._source }
			p1.id = p._id
			return p1
		})
		count = res?.count
		facets = res?.facets
		pageSize = res?.pageSize
		category = res?.category
		err = !res?.estimatedTotalHits ? 'No result Not Found' : null

		return { products, count, facets, pageSize, category, err }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch next product

export const fetchNextPageProducts = async ({
	origin,
	storeId,
	categorySlug,
	server = false,
	nextPage,
	searchParams = {},
	sid = null
}: any) => {
	try {
		let nextPageData = []
		let res: any = {}

		if (server) {
			res = await getBySid(
				`es/products?categories=${categorySlug}&store=${storeId}&page=${nextPage}&${searchParams}`,
				sid
			)
		} else {
			res = await getAPI(
				`es/products?categories=${categorySlug}&store=${storeId}&page=${nextPage}&${searchParams}`,
				origin
			)
		}
		nextPageData = res?.data?.map((p) => {
			const p1 = { ...p._source }
			p1.id = p._id
			return p1
		})

		return {
			nextPageData: nextPageData || [],
			count: res.count,
			estimatedTotalHits: res.estimatedTotalHits,
			facets: res.facets
		}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch related products

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
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
