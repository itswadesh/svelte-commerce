import { getShopifyApi, postShopifyApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchAddresses = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		let selectedAddress = {}
		let myAddresses = []

		res = (await getShopifyApi(`customers/me`, {}, sid)).customer.shipping_address

		return { myAddresses: { data: myAddresses }, selectedAddress, count: res?.count }
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchAddress = async ({ origin, storeId, server = false, sid = null, id }: any) => {
	try {
		let res: any = {}

		res = (await getShopifyApi(`customers/me`, {}, sid)).customer.shipping_address

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
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

		res = (
			await postShopifyApi('customers/me/addresses', {
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

		return res
	} catch (err) {
		error(err.status, err.message)
	}
}
