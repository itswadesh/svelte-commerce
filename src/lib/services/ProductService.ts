import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import {
	getBigCommerceApi,
	getBySid,
	getMedusajsApi,
	getWooCommerceApi,
	postMedusajsApi
} from '$lib/utils/server'
import {
	mapBigcommerceProducts,
	mapMedusajsProduct,
	mapMedusajsAllProducts,
	mapWoocommerceProducts
} from '$lib/utils'
import { provider } from '$lib/config'
import { serializeNonPOJOs } from '$lib/utils/validations'
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
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`es/products?${query}&store=${storeId}`, sid)
				} else {
					res = await getAPI(`es/products?${query}&store=${storeId}`, origin)
				}
				res = res || {}
				let products = []
				products = res.data.map((p) => {
					let p1
					p1 = { ...p._source }
					p1.id = p._id
					return p1
				})
				count = res?.count
				facets = res?.facets
				pageSize = res?.pageSize
				err = !res?.estimatedTotalHits ? 'No result Not Found' : null
				break
			case 'medusajs':
				res = await postMedusajsApi(`products/search?q=${searchData}`, {}, sid)
				products = res?.products
				count = res?.count
				facets = res?.facets || []
				pageSize = res?.pageSize || 25
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`products?${query}`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`products?${query}`, {}, sid)
				break
		}
		return { products, count, facets, pageSize, err }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch all products

export const fetchProducts = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: AllProducts | {} = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`products?store=${storeId}`, sid)
				} else {
					res = await getAPI(`products?store=${storeId}`, origin)
				}
				break
			case 'medusajs':
				const med = (await getMedusajsApi(`products`, {}, sid)).product
				res = mapMedusajsAllProducts(med)
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`products`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`products`, {}, sid)
				break
		}

		return res?.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch single product

export const fetchProduct = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: Product | {} = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`products/${slug}`, sid)
				} else {
					res = await getAPI(`products/${slug}`, origin)
				}
				break
			case 'medusajs':
				const med = (await getMedusajsApi(`products/${id}`, {}, sid)).product
				res = mapMedusajsProduct(med)
				break
			case 'bigcommerce':
				const bi = (await getBigCommerceApi(`products/${id}`, {}, sid)).data
				const images = (await getBigCommerceApi(`products/${id}/images`, {}, sid)).data
				bi.images = images
				res = mapBigcommerceProducts(bi)
				break
			case 'woocommerce':
				const wo = (await getWooCommerceApi(`products/${id}`, {}, sid)).data
				res = mapWoocommerceProducts(wo)
				break
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
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(
						`es/products?categories=${categorySlug}&store=${storeId}&${query}`,
						sid
					)
				} else {
					res = await getAPI(
						`es/products?categories=${categorySlug}&store=${storeId}&${query}`,
						origin
					)
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
				break
			case 'medusajs':
				res = await getMedusajsApi(`products`, {}, sid)
				count = res?.count
				products = res?.products.map((p) => mapMedusajsProduct(p))
				const offset = res?.offset
				const limit = res?.limit
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`products?categories=${categorySlug}`, {}, sid)
				count = res?.count
				facets = res?.facets
				pageSize = res?.pageSize
				category = res?.category
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`products?categories=${categorySlug}`, {}, sid)
				count = res?.count
				facets = res?.facets
				pageSize = res?.pageSize
				category = res?.category
				break
		}
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
		switch (provider) {
			case 'litekart':
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
				break
			case 'medusajs':
				res = await getMedusajsApi(`customers/me`, {}, sid)
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(
					`products?categories=${categorySlug}&page=${nextPage}&${searchParams}`,
					{},
					sid
				)
				nextPageData = res?.data?.map((p) => {
					const p1 = { ...p._source }
					p1.id = p._id
					return p1
				})
				break
			case 'woocommerce':
				res = await getWooCommerceApi(
					`products?categories=${categorySlug}&page=${nextPage}&${searchParams}`,
					{},
					sid
				)
				nextPageData = res?.data?.map((p) => {
					const p1 = { ...p._source }
					p1.id = p._id
					return p1
				})
				break
		}
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
		switch (provider) {
			case 'litekart':
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

				relatedProducts = relatedProductsRes?.data.filter((p) => {
					return p._id !== pid
				})
				break
			case 'medusajs':
				relatedProducts = await getMedusajsApi(`customers/me`, {}, sid)
				break
			case 'bigcommerce':
				relatedProducts = await getBigCommerceApi(`products?categories=${categorySlug}`, {}, sid)
				break
			case 'woocommerce':
				relatedProducts = await getWooCommerceApi(`products?categories=${categorySlug}`, {}, sid)
				break
		}
		return relatedProducts || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
