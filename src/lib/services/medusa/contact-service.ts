import { getMedusajsApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
import type { Error } from '$lib/types'

export const submitContactUsForm = async ({
	storeId,
	fullName,
	email,
	phone,
	subject,
	message,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`contact`, {}, sid)

		return res
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const bulkOrderEnquiry = async ({
	storeId,
	name,
	companayName,
	email,
	phone,
	interestedProducts,
	minQty,
	message,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getMedusajsApi(`contact`, {}, sid)

		return res
	} catch (e) {
		throw error(e.status, e.message)
	}
}
