import { getMedusajsApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

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

		res = {} // await getMedusajsApi(`reviews/me`, {}, sid)

		return {
			data: res.data || [],
			count: res.count,
			pageSize: res.pageSize,
			noOfPage: res.noOfPage,
			page: res.page
		}
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const fetchProductReviews = async ({
	origin,
	storeId,
	pid,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		// res = await getMedusajsApi(`reviews/me`, {}, sid)

		// add dummy data schema for product review

		res = {
			reviewsSummary: [],
			product: {
				count: 0,
				data: [],
				noOfPage: 1
			},
			brand: {
				count: 0,
				noOfPage: 1
			},
			gallery: {
				count: 0,
				data: [],
				noOfPage: 1
			}
		}

		return res?.data || []
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const saveReview = async ({
	storeId,
	id,
	pid,
	message,
	rating,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`reviews/me`, {}, sid)

		return res
	} catch (e) {
		throw error(e.status, e.message)
	}
}
