import { getAPI } from '$lib/utils/api'
import { getBySid, postBySid, delBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
const isServer = import.meta.env.SSR

export const fetchAddresses = async ({ origin, storeId, isCors = false, sid = null }) => {
	try {
		let res: any = {}
		let preSelectedAddress = ''
		let myAddresses = []

		if (isServer || isCors) {
			res = await getBySid(`addresses/my?store=${storeId}`, sid)
		} else {
			res = await getAPI(`addresses/my?store=${storeId}`, origin)
		}
		preSelectedAddress = res?.data[0]?._id
		myAddresses = res?.data || []

		return { myAddresses: { data: myAddresses }, preSelectedAddress, count: res?.count }
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchAddress = async ({ origin, storeId, sid = null, id }) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`addresses/${id}?store=${storeId}`, sid)
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
	sid = null
}) => {
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
	sid = null
}) => {
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

export const deleteAddress = async ({ id, storeId, origin, sid = null }) => {
	try {
		const res = await delBySid(`addresses/${id}?store=${storeId}`, sid)
		return res
	} catch (err) {
		error(err.status || 400, err.message)
	}
}
