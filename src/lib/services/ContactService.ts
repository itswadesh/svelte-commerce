import { provider } from '$lib/config'
import { getMedusajsApi, postBigCommerceApi, postWooCommerceApi } from '$lib/utils/server'
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
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
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
				break
			case 'medusajs':
				res = (await getMedusajsApi(`customers/me`, {}, sid)).customer.shipping_address
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`contact-us`, {})
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`contact-us`, {})
				break
		}
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
		switch (provider) {
			case 'litekart':
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
				break
			case 'medusajs':
				res = (await getMedusajsApi(`customers/me`, {}, sid)).customer.shipping_address
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`bulk-order-enquiry`, {})
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`bulk-order-enquiry`, {})
				break
		}
		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
