import { getBigcommerceApi } from '$lib/utils/server'
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

		res = await getBigcommerceApi(`customers/me`)

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

export const fetchProductReviews = async ({
	origin,
	storeId,
	pid,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getBigcommerceApi(`customers/me`)

		return res?.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
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

		res = await getBigcommerceApi(`customers/me`)

		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
