import { error } from '@sveltejs/kit'
import { getShopifyApi, postShopifyApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import type { AllProducts, Error, Product } from '$lib/types'
import { shopifyInit } from '$lib/utils'

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

		res = await shopifyInit({
			query: `{
				products(first: 10) {
					edges {
						node {
							id
							title
							tags
						}
					}
				}
			}
			`,
			variables: {}
		})

		// console.log('res', res?.products?.edges);

		// return res || {}
		products = res?.products?.edges
		count = res?.products?.edges?.length
		facets = res?.facets || []
		pageSize = res?.pageSize || 25

		return { products, count, facets, pageSize, err }
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// Fetch all products

export const fetchProducts = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: AllProducts | {} = {}

		// const med = (await getShopifyApi(`products`, {}, sid)).product
		// res = mapShopifyAllProducts(med)

		res = await shopifyInit({
			query: `{
				products(first: 10) {
					edges {
						node {
							availableForSale
      createdAt
      descriptionHtml
      description
      handle
      id
      isGiftCard
      onlineStoreUrl
      productType
      publishedAt
      requiresSellingPlan
      tags
      title
      totalInventory
      trackingParameters
      updatedAt
      vendor
						}
					}
				}
			}
			`,
			variables: {}
		})

		return res?.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// Fetch single product

export const fetchProduct = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: Product | {} = {}

		// console.log(origin, slug, id)

		// const med = (await getShopifyApi(`products/${id}`, {}, sid)).product

		const med = await shopifyInit({
			query: `
			      query getProduct($id: String!) {
                product(handle: $id) {
                    id
										title
                    description
										descriptionHtml
										availableForSale
										featuredImage{
											src
										}
										images(first: 5) {
      nodes {
        src
      }
    }
										    variants(first: 10) {
                             nodes {
															availableForSale
        id
        sku
        title
                           price {
                             amount
                             currencyCode
        }
      }
    }
                }
            }
			`,
			variables: {
				id: id
			}
		})

		// res = mapShopifyProduct(med)
		// console.log('med', med.product.variants.nodes);

		const resp = (med) => {
			return {
				id: med.product.id,
				active: med.product.availableForSale,
				hasStock: med.product.availableForSale,
				name: med.product.title,
				description: med.product.descriptionHtml,
				img: med.product.featuredImage.src,
				images: med.product.images.nodes.map((i) => {
					return i.src
				}),
				mrp: med.product.variants.nodes[0].price.amount,
				price: med.product.variants.nodes[0].price.amount,
				variants: med.product.variants.nodes
			}
		}

		res = resp(med)
		// console.log('res', res)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}


export const fetchProduct2 = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: Product | {} = {}

		// console.log(origin, slug, id)

		// const med = (await getShopifyApi(`products/${id}`, {}, sid)).product

		const med = await shopifyInit({
			query: `
			      query getProduct($id: String!) {
                product(handle: $id) {
                    id
										title
                    description
										descriptionHtml
										availableForSale
										featuredImage{
											src
										}
										images(first: 5) {
      nodes {
        src
      }
    }
										    variants(first: 10) {
                             nodes {
															availableForSale
        id
        sku
        title
                           price {
                             amount
                             currencyCode
        }
      }
    }
                }
            }
			`,
			variables: {
				id: id
			}
		})

		// res = mapShopifyProduct(med)
		// console.log('med', med.product.variants.nodes)

		const resp = (med) => {
			return {
				id: med.product.id,
				active: med.product.availableForSale,
				hasStock: med.product.availableForSale,
				name: med.product.title,
				description: med.product.descriptionHtml,
				img: med.product.featuredImage.src,
				images: med.product.images.nodes.map((i) => {
					return i.src
				}),
				mrp: med.product.variants.nodes[0].price.amount,
				price: med.product.variants.nodes[0].price.amount,
				variants: med.product.variants.nodes
			}
		}

		res = resp(med)
		// console.log('res', res)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
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

		// res = await getShopifyApi(`products`, {}, sid)

			const med = await shopifyInit({
				query: ` {
			     products(first: 10) {
    nodes {
      id
      title
      handle
			description
      featuredImage {
        src
      }
      availableForSale
      vendor
    }
  }
}
			`,
				variables: {}
			})
		

			// console.log('res', med.products.nodes);
			
		
			const mapShopifyProduct = (p) => {
				return {
					id: p?.id,
					slug: p?.handle,
					active: p?.availableForSale,
					hasStock: p?.availableForSale,
					name: p?.title,
					description: p?.description,
					img: p?.featuredImage?.src
				}
			}
		

		// console.log(med.products.nodes.map((p) => {mapShopifyProduct(p)}))
		
		
		count = med.products.nodes.length //res?.count
		products = med.products.nodes.map((p) => mapShopifyProduct(p))
		
		// console.log('products', products);
		
		

		
		const offset = res?.offset || '100'
		const limit = res?.limit || '100'

		return { products, count, facets, pageSize, category, err }
	} catch (e) {
		error(e.status, e.data?.message || e.message)
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

		res = await getShopifyApi(`customers/me`, {}, sid)

		return {
			nextPageData: nextPageData || [],
			count: res.count,
			estimatedTotalHits: res.estimatedTotalHits,
			facets: res.facets
		}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
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

		relatedProducts = await getShopifyApi(`customers/me`, {}, sid)

		return relatedProducts || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
