import { getShopifyApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'
import { shopifyInit } from 'lib/utils'

export const fetchFooterCategories = async ({
	origin,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let data: []

		data = await shopifyInit({
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

		console.log('res', data);

		// return res || {}
		return data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchCategory = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await getShopifyApi(`product-categories/${id}`, {}, sid)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
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

		res = await shopifyInit({
			query: `{
    collections(first: 5) {
      edges {
        node {
          id
          title
          handle
          updatedAt
        }
      }
    }
  }
			`,
			variables: {}
		})

		// console.log('res', res);

		// return res || {}

		return { data, pageSize, currentPage }
	} catch (e) {
		error(e.status, e.data?.message || e.message)
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

		// res = await getShopifyApi(`customers/me`, {}, sid)

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

		// console.log('res', res);

		// return res || {}

		return { products, productsCount, currentPage, facets, err }
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchMegamenuData = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let data: []

		data = await shopifyInit({
			query: `{
    collections(first: 5) {
      edges {
        node {
          id
          title
          handle
          updatedAt
        }
      }
    }
  }
			`,
			variables: {}
		})

		// console.log('res', res);

		// return res || {}
		return data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
