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
		error(e.status, e.message)
	}
}

// Fetch all products

export const fetchProducts = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: AllProducts | {} = {}

		const med = await getMedusajsApi(`products`)
		res = mapMedusajsAllProducts(med)
		return res || {}
	} catch (e) {
		error(e.status, e.message)
	}
}

// Fetch single product

export const fetchProduct = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: Product | {} = {}
		const med = await getMedusajsApi(
			`products?handle=${slug}&expand=variants,variants.prices,images&currency_code=usd`
		)
		const productArray = med?.products || [] // fetch the products array value from the med variable
		res = await mapMedusajsProduct(productArray[0]) // assuming we only want the first product in the array
		return res || {}
	} catch (e) {
		error(e.status, e.message)
	}
}

// Fetch other single product

export const fetchProduct2 = async ({ origin, slug, vid, server = false, sid = null }: any) => {
	try {
		let res: Product | {} = {}
		const med = await getMedusajsApi(
			`variants/${vid}&expand=variants,variants.prices,images&currency_code=usd`
		)

		const productArray = med.products || [] // fetch the products array value from the med variable

		res = mapMedusajsProduct(productArray[0]) // assuming we only want the first product in the array

		return res || {}
	} catch (e) {
		error(e.status, e.message)
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
					products = res2?.products.map((p) => mapMedusajsProduct(p))
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
		error(e.status, e.message)
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
		error(e.status, e.message)
	}
}
