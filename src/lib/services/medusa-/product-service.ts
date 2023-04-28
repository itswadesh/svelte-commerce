import { error } from '@sveltejs/kit'
import { getMedusajsApi, postMedusajsApi } from '$lib/utils/server'
import type { AllProducts, Product } from '$lib/types'
import { mapMedusajsAllProducts, mapMedusajsProduct } from './medusa-utils'

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

		res = await postMedusajsApi(`products/search?q=${searchData}`, {})
		products = res?.products
		count = res?.count
		facets = res?.facets || []
		pageSize = res?.pageSize || 25

		return { products, count, facets, pageSize, err }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch all products

export const fetchProducts = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: AllProducts | {} = {}

		const med = (await getMedusajsApi(`products`)).product
		res = mapMedusajsAllProducts(med)

		return res?.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch single product

export const fetchProduct = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: Product | {} = {}

		const med = (await getMedusajsApi(`products/${id}`)).product
		res = mapMedusajsProduct(med)

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

		res = await getMedusajsApi(`products`)
		count = res?.count
		products = res?.products.map((p) => mapMedusajsProduct(p))
		const offset = res?.offset
		const limit = res?.limit
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

		res = await getMedusajsApi(`products`)

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
		let relatedProducts: Product[] = []

		relatedProducts = await getMedusajsApi(`products`)

		return relatedProducts || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
