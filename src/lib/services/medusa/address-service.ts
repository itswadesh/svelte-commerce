import { getMedusajsApi, postMedusajsApi } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export const fetchAddresses = async ({
	origin,
	storeId,
	server = false,
	sid = 's:rbsl8gACO6pZuNvSnQNo1LKTpxUKaQnl.3B6p9hkKCV4dQOGLNmCqA4fhj70AAhv2bSGRtCmom0I'
}: any) => {
	try {
		let res: any = {}
		let selectedAddress = {}
		let myAddresses = []

		res = await getMedusajsApi(`customers/me`, {}, sid)
		myAddresses = res?.customer?.shipping_addresses
		if (myAddresses?.length) {
			selectedAddress = myAddresses[0]
		}
		return { myAddresses: { data: myAddresses }, selectedAddress, count: res?.count }
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const fetchAddress = async ({ origin, storeId, server = false, sid = null, id }: any) => {
	try {
		let res: any = {}

		res = (await getMedusajsApi(`customers/me/addresses/${id}`, {}, sid))?.customer
			?.shipping_addresses

		return res || {}
	} catch (e) {
		throw error(e.status, e.message)
	}
}

export const saveAddress = async ({
	id,
	address,
	city,
	country,
	email,
	firstName,
	landmark,
	lastName,
	locality,
	phone,
	state,
	zip,
	storeId,
	origin,
	sid = null
}: any) => {
	try {
		let res: any = {}
		const addr = {
			address: {
				address_1: address,
				address_2: locality,
				city,
				country_code: 'IN',
				first_name: firstName,
				landmark,
				last_name: lastName,
				phone,
				postal_code: zip,
				province: state
			}
		}
		res = await postMedusajsApi('customers/me/addresses', addr, sid)
		const shipping_addresses = res?.customer?.shipping_addresses
		if (shipping_addresses) {
			return shipping_addresses[0]
		} else {
			throw error(404, 'Error occured while saving address')
		}
	} catch (err) {
		throw error(err.status || 400, err.message)
	}
}
