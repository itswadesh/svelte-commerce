import { error } from '@sveltejs/kit'
import { getAPI, post } from '$lib/utils/api'
import type { AllProducts } from '$lib/types'
import {
	mapProdexaAllProducts,
	mapProdexaAttrFacets,
	mapProdexaFacet,
	mapProdexaFacets,
	mapProdexaProduct,
	SLUG_SEPARATOR,
	LANGUAGE_TAG,
	ATTRIBUTE_SHORT_DESCRIPTION
} from './prodexa-utils'
import queryString from 'query-string'
import { currencyCode } from '$lib/config'

const productsEndpoint = 'products/search/full-product'
const productsFacetsEndpoint = 'products/search/facets'

const parseQueryString = (query, categorySlug = null) => {
	const params = queryString.parse(query)

	// sort
	let sort = params.sort as string
	let direction: 'asc' | 'desc' | null

	if (sort) {
		if (sort.startsWith('-')) {
			sort = sort.substring(1)
			direction = 'desc'
		} else {
			direction = 'asc'
		}

		sort = ({
			name: `attrValue_string_${ATTRIBUTE_SHORT_DESCRIPTION}_${LANGUAGE_TAG}`,
			updatedAt: 'changedOn',
			price: 'minPrice_' + currencyCode
		})[sort]

		if (sort) {
			sort = sort + ',' + direction
		}
	}

	// backend page starts from 0, svelte page starts from 1
	const page = params.page ? (params.page as unknown as number - 1) : 0

	// q - query string from search field
	const searchValue = params.q || ''

	const manufacturerId = params.brands || ''
	const supplierId = params.vendors || ''

	let attributeValues = {}
	Object.keys(params)
		.filter((param) => !['sort', 'page', 'q', 'brands', 'vendors'].includes(param))
		.forEach((param) => {
			attributeValues[param] = params[param] instanceof Array ? params[param] : [params[param]]
		})

	const hierarchyPaths = categorySlug ? [`/${categorySlug}`] : []

	return ({
		query: {
			searchValue,
			page,
			sort
		},
		searchData: {
			facetParams: {
				hierarchyPaths,
				manufacturerId,
				supplierId,
				attributeValues
			}
		}
	})
}

const stringifySearchParams = (searchParams) => {
	const queryStr = queryString.stringify(searchParams.query, {
		skipNull: true,
		skipEmptyString: true
	})
	return queryStr ? `?${queryStr}` : ''
}

const fetchFacets = async ({ searchParams, origin }) => {
	const searchData = searchParams.searchData
	const query = stringifySearchParams(searchParams)

	const brands = mapProdexaFacets(await post(
		`${productsFacetsEndpoint}/fields/manufacturerId${query}`,
		searchData,
		origin
	))

	const vendors = mapProdexaFacets(await post(
		`${productsFacetsEndpoint}/fields/supplierId${query}`,
		searchData,
		origin
	))

	const attributes = mapProdexaAttrFacets(await post(
		`${productsFacetsEndpoint}/attributes${query}`,
		searchData,
		origin
	))

	// TODO need to have only one call that will fetch attr with values
	attributes.all.key.buckets = await Promise.all(
		attributes.all.key.buckets.map((bucket) => post(
				`${productsFacetsEndpoint}/attribute-values/${bucket.id}/${query}`,
				searchData,
				origin
			)
				.then(res => res.map(mapProdexaFacet))
				.then(res => ({ ...bucket, value: { buckets: res } }))
		)
	)

	return {
		all_aggs: {
			doc_count: 1,
			brands,
			vendors,
			attributes
		}
	}
}

// Fetch all products called from the search field
export const fetchProducts = async ({ query = '', origin }: any) => {
	const searchParams = parseQueryString(query)

	try {
		const productsPage = await post(
			`${productsEndpoint}${stringifySearchParams(searchParams)}`,
			searchParams.searchData,
			origin
		)

		const facets = await fetchFacets({ searchParams, origin })

		return mapProdexaAllProducts({ ...productsPage, facets }) || []

	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// Fetch single product
export const fetchProduct = async ({ origin, slug }) => {
	try {
		const product = await getAPI(
			`product-editor/products/${slug.replace(SLUG_SEPARATOR, '/')}`,
			origin
		)
		return mapProdexaProduct(product)
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// TODO ...
// Fetch products more requirements
// the same as fetchProduct
// used by routes/(product)/product/[slug]/+page.svelte
// while fetchProduct used by routes/(product)/product/[slug]/+page.ts
// this is weird and as a result we have 2 product api calls
// on the product details page
export const fetchProduct2 = fetchProduct

// Fetch products based on category called when selecting category
export const fetchProductsOfCategory = async ({ categorySlug, origin, query }) => {
	const searchParams = parseQueryString(query, categorySlug)

	try {
		const productsPage = await post(
			`${productsEndpoint}${stringifySearchParams(searchParams)}`,
			searchParams.searchData,
			origin
		)

		const products = productsPage?.content?.map((p) => mapProdexaProduct(p))
		const facets = await fetchFacets({ searchParams, origin })

		const count = productsPage?.totalElements
		const pageSize = productsPage?.size
		const category = categorySlug
		const err = !productsPage?.totalElements ? 'No result Not Found' : null
		const currentPage = productsPage?.totalPages + 1

		return {
			category,
			count,
			currentPage,
			err,
			pageSize,
			products,
			facets: facets as unknown as string
		}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

// Fetch next product
export const fetchNextPageProducts = async ({ categorySlug, nextPage, searchParams: query = {}, origin }) => {
	const searchParams = parseQueryString(query)
	searchParams.query.page = nextPage - 1

	try {
		const productsPage = await post(
			`${productsEndpoint}${stringifySearchParams(searchParams)}`,
			searchParams.searchData,
			origin
		)

		const nextPageData = productsPage.content.map((p) => mapProdexaProduct(p))
		const facets = await fetchFacets({ searchParams: searchParams, origin })

		return {
			category: categorySlug,
			count: productsPage.totalElements,
			estimatedTotalHits: productsPage.totalElements,
			facets,
			nextPageData
		}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchReels = async ({}: any) => {

	try {
		let res: AllProducts | {} = {}

		// TODO ...

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export declare const fetchRelatedProducts: ({ origin, storeId, categorySlug, pid, sid }: {
	origin: any;
	storeId: any;
	categorySlug: any;
	pid: any;
	sid?: any;
}) => Promise<any>