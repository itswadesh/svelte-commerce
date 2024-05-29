import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { mapProdexaCategoryClassification } from './prodexa-utils'
import type { Category } from '$lib/types'

export const fetchFooterCategories = async ({}) => {
	console.log('fetchFooterCategories')
	try {
		let data: []
		// TODO ...
		return data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchCategory = async ({ children = false, id, origin }) => {
	try {
		const res = await getAPI(`classifications/${id}`, origin)
		return mapProdexaCategoryClassification(res) || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// fill 'POPULAR SEARCHES' section with categories limit = 1000
export const fetchAllCategories = async ({ featured = false, limit = null, origin }) => {
	try {
		const res = await getAPI(
			`classifications/search/findAllByParams?page=0&size=${limit || '1000'}`,
			origin
		)

		const data = res.content.map((category: any) => mapProdexaCategoryClassification(category))

		const currentPage = res.number
		const pageSize = res.size

		return { data, pageSize, currentPage }
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchAllProductsOfCategories = async ({ featured = false, origin, storeId }) => {
	try {
		let products = []
		let productsCount = 0
		let currentPage = 0
		let facets = {}
		let err = null

		let catQ = `categories?store=${storeId}`
		if (featured) {
			catQ += '&featured=true'
		}

		const res = await getAPI(catQ, origin)

		// must return link:string, slug:string(optional) name:string, new:boolean
		currentPage = res?.page
		err = !products ? 'No result Not Found' : null
		facets = res?.facets?.all_aggs
		products = res?.data || []
		productsCount = res?.count

		return { products, productsCount, currentPage, facets, err }
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchMegamenuData = async ({ megamenu = false, origin }) => {

	try {
		const data = await getAPI(
			`classifications/search/findAllByParams?sort=orderNo,asc&page=0&size=1000`,
			origin
		)

		const allCategories = data.content.map((category: any) => {
			return mapProdexaCategoryClassification(category)
		})

		// to navigate any megamenu item to the categories page
		// it has to have the slug: 'categories'

		let menuItems: Category[] = []

		for (let i = 0; i < 2; i++) {
			if (allCategories.length > i) {
				const c: Category = {
					id: allCategories[i].id,
					name: allCategories[i].name,
					slug: allCategories[i].slug,
					children: allCategories[i]
				}
				menuItems.push(c)
			}
		}

		if (allCategories.length > 2) {
			const c: Category = {
				id: 'otherCategories',
				name: 'Other categories',
				slug: 'categories',
				children: allCategories.slice(2, allCategories.length)
			}
			menuItems.push(c)
		}

		return menuItems as [] || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export declare const fetchCategoriesSelectedByUser: ({ isCors, origin, sid, storeId }: {
	isCors?: boolean;
	origin: any;
	sid?: any;
	storeId: any;
}) => Promise<[]>