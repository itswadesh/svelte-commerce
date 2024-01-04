import { error } from '@sveltejs/kit'
import type { Error } from '$lib/types'
import { post } from '$lib/utils/api'

export const submitContactUsForm = async ({
	storeId,
	fullName,
	email,
	phone,
	subject,
	message,
	origin,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`contact-us`,
			{
				fullName,
				email,
				phone,
				subject,
				message,
				store: storeId
			},
			origin
		)

		return res
	} catch (err) {
		const e = err as Error
		error(e.status, e.data.message)
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
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`bulk-order-enquiry`,
			{
				name,
				companayName,
				email,
				phone,
				interestedProducts,
				minQty,
				message,
				store: storeId
			},
			origin
		)

		return res
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
