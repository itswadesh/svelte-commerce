import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI, post } from '$lib/utils/api'
import {
	getBigCommerceApi,
	getBySid,
	getMedusajsApi,
	getWooCommerceApi,
	postBigCommerceApi,
	postMedusajsApi,
	postWooCommerceApi
} from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchAddresses = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		let selectedAddress = {}
		let myAddresses = []
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`addresses/my?store=${storeId}`, sid)
				} else {
					res = await getAPI(`addresses/my?store=${storeId}`, origin)
				}
				selectedAddress = res?.data[0]?._id
				myAddresses = res.data || []
				break
			case 'medusajs':
				res = (await getMedusajsApi(`customers/me`, {}, sid)).customer.shipping_address
				break
			case 'bigcommerce':
				myAddresses = (await getBigCommerceApi(`addresses/my`, {}, sid)).data
				selectedAddress = myAddresses[0]?._id
				break
			case 'woocommerce':
				myAddresses = (await getWooCommerceApi(`addresses/my`, {}, sid))?.data
				selectedAddress = myAddresses[0]?._id
				break
		}
		return { myAddresses: { data: myAddresses }, selectedAddress, count: res?.count }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchAddress = async ({ origin, storeId, server = false, sid = null, id }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`addresses/${id}`, sid)
				} else {
					res = await getAPI(`addresses/${id}`, origin)
				}
				break
			case 'medusajs':
				res = (await getMedusajsApi(`customers/me`, {}, sid)).customer.shipping_address
			case 'bigcommerce':
				res = await getBigCommerceApi(`addresses/${id}`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`addresses/${id}`, {}, sid)
				break
		}
		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const saveAddress = async ({
	id,
	address,
	city,
	country,
	email,
	firstName,
	lastName,
	locality,
	phone,
	state,
	zip,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await post(
					`addresses`,
					{
						id,
						address,
						city,
						country,
						email,
						firstName,
						lastName,
						locality,
						phone,
						state,
						zip,
						store: storeId
					},
					origin
				)
				break
			case 'medusajs':
				res = (
					await postMedusajsApi('customers/me/addresses', {
						address_1: address,
						address_2: locality,
						city,
						country_code: country,
						email,
						first_name: firstName,
						landmark,
						last_name: lastName,
						phone,
						postal_code: zip,
						province: state,
						state
					})
				).customer
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`address`, {})
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`address`, {})
				break
		}
		return res
	} catch (err) {
		throw error(err.status, err.message)
	}
}
