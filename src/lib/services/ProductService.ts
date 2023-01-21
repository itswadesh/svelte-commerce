import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI } from '$lib/utils/api'
import { getBigCommerceApi, getBySid, getWooCommerceApi } from '$lib/utils/server'
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
		let products: any = []
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
				res = res || []
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
			case 'bigcommerce':
				res = await getBigCommerceApi(`products?${query}`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`products?${query}`, {}, sid)
				break
		}
		return { products, count, facets, pageSize, err }
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchProduct = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`products/${slug}`, sid)
				} else {
					res = await getAPI(`products/${slug}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`products/${id}`, {}, sid)
				break
			case 'woocommerce':
				const p = (await getWooCommerceApi(`products/${id}`, {}, sid)).data
				if (p) {
					res = {
						id: p.id,
						name: p.name,
						slug: p.slug,
						createdAt: p.date_created,
						modifiedAt: p.date_modified,
						type: p.type,
						status: p.status,
						featured: p.featured,
						active: p.catalog_visibility,
						description: p.description,
						short_description: p.short_description,
						sku: p.sku,
						price: p.price,
						mrp: p.regular_price,
						sale_price: p.sale_price,
						on_sale: p.on_sale,
						varified: p.purchasable,
						popularity: p.total_sales,
						digital: p.virtual,
						link: p.external_url,
						stock: p.stock_quantity,
						low_stock_amount: p.low_stock_amount,
						weight: p.weight,
						dimensions: p.dimensions,
						averageRating: p.average_rating,
						ratingRount: p.rating_count,
						categories: p.categories,
						tags: p.tags,
						attributes: p.attributes,
						default_attributes: p.default_attributes,
						variations: p.variations,
						grouped_products: p.grouped_products,
						related_products: p.related_ids,
						stock_status: p.stock_status,
						has_options: p.has_options,
						images: p.images.map((i) => {
							if (i) return i.src
						})
					}
					res.img = res.images[0]
				}
				break
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
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`products?store=${storeId}`, sid)
				} else {
					res = await getAPI(`products?store=${storeId}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`products`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`products`, {}, sid)
				break
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
		let products: any = []
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
		let nextPageData = []
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`es/products?categories=${categorySlug}&store=${storeId}`, sid)
				} else {
					res = await getAPI(`es/products?categories=${categorySlug}&store=${storeId}`, origin)
				}
				nextPageData = res?.data?.map((p) => {
					const p1 = { ...p._source }
					p1.id = p._id
					return p1
				})
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`products?categories=${categorySlug}`, {}, sid)
				nextPageData = res?.data?.map((p) => {
					const p1 = { ...p._source }
					p1.id = p._id
					return p1
				})
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`products?categories=${categorySlug}`, {}, sid)
				nextPageData = res?.data?.map((p) => {
					const p1 = { ...p._source }
					p1.id = p._id
					return p1
				})
				break
		}
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
		let relatedProducts: any = []
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
			case 'bigcommerce':
				relatedProducts = await getBigCommerceApi(`products?categories=${categorySlug}`, {}, sid)
				break
			case 'woocommerce':
				relatedProducts = await getWooCommerceApi(`products?categories=${categorySlug}`, {}, sid)
				break
		}
		return relatedProducts || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}
