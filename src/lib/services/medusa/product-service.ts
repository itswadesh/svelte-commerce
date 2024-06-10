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
		// res = await postMedusajsApi(`products/search?q=${searchData}`, { q: searchData })
		// products = res?.hits
		// count = res?.count || 0
		// facets = res?.facets || []
		// pageSize = res?.pageSize || 25

		res = await getMedusajsApi(`products`) // temporary solution for the search api = shows all the elements
		products = res?.products || []
		count = res?.count || 0
		pageSize = res?.pageSize || 24

		return { products, count, facets, pageSize, err }
	} catch (e) {
		error(e.status, e.message)
	}
}

// Fetch all products

export const fetchProducts = async ({ origin, slug, id }: any) => {
	try {
		let res: AllProducts | {} = {}

		const med = await getMedusajsApi(`products`)
		console.log('med', med)
		res = mapMedusajsAllProducts(med)
		console.log('res', res)

		return res || []
	} catch (e) {
		error(e.status, e.message)
	}
}

// Fetch single product

export const fetchProduct = async ({ origin, slug, id }: any) => {
	try {
		let res: Product | {} = {}
		const med = await getMedusajsApi(
			// `products?handle=${slug}&expand=categories,variants,variants.prices,images&currency_code=usd`
			`products/${id}`
		)
		res = med?.product || {}
		return res
	} catch (e) {
		error(e.status, e.message)
	}
}

// Fetch other single product

// export const fetchProduct2 = async ({ origin, slug, id, server = false, sid = null }: any) => {
// 	try {
// 		let res: Product | {} = {}
// 		const med = await getMedusajsApi(
// 			`products?handle=${slug}&expand=categories,variants,variants.prices,images`
// 		)

// 		const productArray = med.products || [] // fetch the products array value from the med variable

// 		res = mapMedusajsProduct(productArray[0]) // assuming we only want the first product in the array

// 		return res || {}
// 	} catch (e) {
// 		error(e.status, e.message)
// 	}
// }

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
		let res1: any = {}
		let res2: any = {}

		let categories = []
		let category = {}
		let count = 0
		let currentPage = 0
		let err = ''
		let facets = ''
		let pageSize = 0
		let products: Product[] = []

		res1 = await getMedusajsApi(`product-categories`)

		if (res1?.count) {
			categories = res1?.product_categories.filter((c) => {
				if (c.handle === categorySlug) {
					return c
				}
			})

			// console.log('categories', categories);

			if (categories) {
				category = categories[0]

				try {
					res2 = await getMedusajsApi(`products?category_id[]=${category?.id}`)

					count = res2?.count
					products = res2?.products.map((p: any) => mapMedusajsProduct(p))
					currentPage = res2?.offset
					pageSize = res2?.limit

					return {
						category,
						count,
						currentPage,
						err,
						facets,
						pageSize,
						products
					}
				} catch (e) {
					error(e.status, e.message)
				}
			}
		}
	} catch (e) {
		error(e.status, e.message)
	}
}

// Fetch next product

// export const fetchNextPageProducts = async ({
// 	origin,
// 	storeId,
// 	categorySlug,
// 	server = false,
// 	nextPage,
// 	searchParams = {},
// 	sid = null
// }: any) => {
// 	try {
// 		let nextPageData = []
// 		let res: any = {}

// 		res = await getMedusajsApi(`products`)

// 		return {
// 			nextPageData: nextPageData || [],
// 			count: res.count,
// 			estimatedTotalHits: res.estimatedTotalHits,
// 			facets: res.facets
// 		}
// 	} catch (e) {
// 		error(e.status, e.message)
// 	}
// }

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
		error(e.status, e.message)
	}
}

//Get product Variants

export const fetchVariants = async ({ origin, slug, id, regionId, currencyCode, cartId }: any) => {
	try {
		let queryParams = []
		if (cartId) queryParams.push(`cart_id=${cartId}`)
		if (regionId) queryParams.push(`region_id=${regionId}`)
		if (currencyCode) queryParams.push(`currency_code=${currencyCode}`)

		let res = []
		let count = 0
		let params = ''
		if (queryParams.length > 0) {
			params += `?${queryParams.join('&')}`
		}

		res = (await getMedusajsApi(`variants${params}`)).variants
		count = res?.length || 0
		return res || []
	} catch (e) {
		error(e.status, e.message)
	}
}

// fetch single variant
// export const fetchSingleVariant = async ({
// 	origin,
// 	slug,
// 	id,
// 	server = false,
// 	sid = null,
// 	regionId,
// 	currencyCode,
// 	cartId,
// 	salesChannelId
// }: any) => {
// 	try {
// 		let queryParams = []
// 		if (cartId) queryParams.push(`cart_id=${cartId}`)
// 		if (regionId) queryParams.push(`reigon_id=${regionId}`)
// 		if (currencyCode) queryParams.push(`currency_code=${currencyCode}`)
// 		if (salesChannelId) queryParams.push(`sales_channel_id=${salesChannelId}`)

// 		let res = {}
// 		let params = ''
// 		if (queryParams.length > 0) {
// 			params += `?${queryParams.join('&')}`
// 		}

// 		res = await getMedusajsApi(`variants${params}`)
// 		return res || {}
// 	} catch (e) {
// 		error(e.status, e.message)
// 	}
// }

// Fetch Collections

export const fetchCollections = async ({
	origin,
	slug,
	id,
	server = false,
	sid = null,
	offset,
	limit,
	created_at,
	updated_at
}: any) => {
	try {
		let count = 0
		let offsets = 0
		let collections = []

		let queryParams = []
		if (offset) queryParams.push(`offset=${offset}`)
		if (limit) queryParams.push(`limit=${limit}`)
		if (created_at) queryParams.push(`created_at=${created_at}`)
		if (updated_at) queryParams.push(`updated_at=${updated_at}`)

		let params = ''
		if (queryParams.length > 0) {
			params += `?handle=${id}${queryParams.join('&')}`
		}

		let res: any = {}
		res = await getMedusajsApi(`collections${params}`)
		console.log(res)

		count = res?.count || 0
		offsets = res?.offset || 0
		collections = res?.collections || []

		return { collections, count, offsets }
	} catch (e) {
		error(e.status, e.message)
	}
}

// Fetch a single Collection

export const fetchSingleCollection = async ({
	origin,
	slug,
	id,
	server = false,
	sid = null
}: any) => {
	try {
		let collection = {}

		let res: any = {}
		res = await getMedusajsApi(`collections/${id}`)
		collection = res?.collection || {}

		return collection
	} catch (e) {
		error(e.status, e.message)
	}
}

// Fetch Product-Tags

export const fetchProductTags = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let productTags = []
		let count = 0
		let offset = 0
		let limit = 0

		let res: any = {}
		res = await getMedusajsApi(`/product-tags`)
		productTags = res?.product_tags || {}
		count = res?.count || 0
		offset = res?.offset || 0
		limit = res?.limit || 24

		return { productTags, count, offset, limit }
	} catch (e) {
		error(e.status, e.message)
	}
}

// Fetch Product-Types

export const fetchProductTypes = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let productTypes = []
		let count = 0
		let offset = 0
		let limit = 0

		let res: any = {}
		res = await getMedusajsApi(`/product-types`)
		productTypes = res?.product_tags || {}
		count = res?.count || 0
		offset = res?.offset || 0
		limit = res?.limit || 24

		return { productTypes, count, offset, limit }
	} catch (e) {
		error(e.status, e.message)
	}
}
