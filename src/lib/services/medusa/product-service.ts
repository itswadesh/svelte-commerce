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
		res = await postMedusajsApi(`products/search?q=${searchData}`, { q: searchData })
		products = res?.hits
		count = res?.count || 0
		facets = res?.facets || []
		pageSize = res?.pageSize || 25

		return { products, count, facets, pageSize, err }
	} catch (e) {
		throw error(e.status, e.message)
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
		throw error(e.status, e.message)
	}
}

// Fetch single product

export const fetchProduct = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: Product | {} = {}
		const med = await getMedusajsApi(
			`products?handle=${slug}&expand=categories,variants,variants.prices,images&currency_code=usd`
		)
		const productArray = med?.products || [] // fetch the products array value from the med variable
		res = await mapMedusajsProduct(productArray[0]) // assuming we only want the first product in the array
		return res || {}
	} catch (e) {
		throw error(e.status, e.message)
	}
}

// Fetch other single product

export const fetchProduct2 = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: Product | {} = {}
		const med = await getMedusajsApi(
			`products?handle=${slug}&expand=categories,variants,variants.prices,images`
		)

		const productArray = med.products || [] // fetch the products array value from the med variable

		res = mapMedusajsProduct(productArray[0]) // assuming we only want the first product in the array

		return res || {}
	} catch (e) {
		throw error(e.status, e.message)
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
		res = await getMedusajsApi(`products?category_id[]=${categorySlug}`)
		count = res?.count
		products = res?.products.map((p) => mapMedusajsProduct(p))
		const offset = res?.offset
		const limit = res?.limit
		return { products, count, facets, pageSize, category, err }
	} catch (e) {
		throw error(e.status, e.message)
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
		throw error(e.status, e.message)
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
		throw error(e.status, e.message)
	}
}
