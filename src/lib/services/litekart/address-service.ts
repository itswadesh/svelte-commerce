import { del, getAPI, post } from '$lib/utils/api'
import { getBySid, postBySid, postt, delBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
const isServer = import.meta.env.SSR

export const fetchAddresses = async ({
	origin,
	storeId,
	isCors = false,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		let selectedAddress = {}
		let myAddresses = []

		if (isServer || isCors) {
			res = await getBySid(`addresses/my?store=${storeId}`, sid)
		} else {
			res = await getAPI(`addresses/my?store=${storeId}`, origin)
		}
		selectedAddress = res?.data[0]?._id
		myAddresses = res?.data || []

		return { myAddresses: { data: myAddresses }, selectedAddress, count: res?.count }
	} catch (e) {
		// if (e.message !== 'Unauthorized') {
		error(e.status, e.data?.message || e.message)
		// } else {
		// 	return { myAddresses: { data: [] }, selectedAddress: {}, count: 0 }
		// }
	}
}

export const fetchAddress = async ({ origin, storeId, server = false, sid = null, id }: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`addresses/${id}`, sid)
		} else {
			res = await getAPI(`addresses/${id}`, origin)
		}

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

		res = await postBySid(
			`addresses`,
			{
				id,
				address,
				city,
				country,
				email,
				firstName,
				lastName,
				phone,
				state,
				zip,
				store: storeId
			},
			sid
		)

		return res
	} catch (err) {
		error(err.status, err.message)
	}
}

export const editAddress = async ({
	id,
	address,
	city,
	company,
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
		res = await postBySid(
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
			sid
		)
		return res
	} catch (err) {
		error(err.status, err.message)
	}
}

export const deleteAddress = async ({ id, storeId, origin, sid = null }: any) => {
	try {
		const res = await delBySid(`addresses/${id}`, sid)
	} catch (err) {
		error(err.status || 400, err.message)
	}
}
