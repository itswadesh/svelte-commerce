import { error } from '@sveltejs/kit'
import { getAPI, post } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import type { ProductReview } from '$lib/types'

export const fetchReviews = async ({
	origin,
	storeId,
	pid,
	search,
	sort,
	currentPage,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await getBySid(
				`es/reviews/${pid}?search=${
					search || ''
				}&sort=${sort}&page=${currentPage}&store=${storeId}`,
				sid
			)
		} else {
			res = await getAPI(
				`es/reviews/${pid}?search=${
					search || ''
				}&sort=${sort}&page=${currentPage}&store=${storeId}`,
				origin
			)
		}

		return {
			data: res.data || [],
			count: res.count,
			pageSize: res.pageSize,
			noOfPage: res.noOfPage,
			page: res.page
		}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch product reviews

export const fetchProductReviews = async ({
	brandId,
	origin,
	page,
	pid,
	server = false,
	sid = null,
	storeId
}: any) => {
	try {
		let productReviewsRes: any = {}
		// : ProductReviews[]
		let productReviews: ProductReview = []

		if (server) {
			productReviewsRes = await getBySid(
				`reviews/product-reviews?pid=${pid}&brandId=${brandId}&page=${page}&sort=-createdAt&store=${storeId}`,
				sid
			)
		} else {
			productReviewsRes = await getAPI(
				`reviews/product-reviews?pid=${pid}&brandId=${brandId}&page=${page}&sort=-createdAt&store=${storeId}`,
				origin
			)
		}

		productReviews = productReviewsRes

		return productReviews || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const saveReview = async ({
	id,
	images,
	message,
	oid,
	pid,
	rating,
	storeId,
	origin
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`reviews`,
			{
				id,
				images,
				message,
				oid,
				pid,
				rating,
				store: storeId
			},
			origin
		)

		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch next page product reviews

export const fetchNextPageProductReviews = async ({
	origin,
	storeId,
	page,
	type,
	pid,
	server = false,
	sid = null
}: any) => {
	try {
		let productReviewsRes: any = {}
		// : ProductReviews[]
		let nextPageData: ProductReview = []

		if (server) {
			productReviewsRes = await getBySid(
				`reviews/product-reviews?pid=${pid}&page=${page}&type=${type}&store=${storeId}`,
				sid
			)
		} else {
			productReviewsRes = await getAPI(
				`reviews/product-reviews?pid=${pid}&page=${page}&type=${type}&store=${storeId}`,
				origin
			)
		}

		nextPageData = productReviewsRes

		return nextPageData || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
