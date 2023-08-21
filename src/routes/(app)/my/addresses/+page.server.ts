import { AddressService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ cookies, locals }) {
	const { myAddresses, selectedAddress, count } = await AddressService.fetchAddresses({
		storeId: locals.store?.id,
		server: true,
		sid: cookies.get('connect.sid')
	})

	myAddresses.count = count

	if (myAddresses) {
		return { addresses: myAddresses, selectedAddress }
	}

	throw error(404, 'Addresses not found')
}

const saveAddress = async ({ request, cookies, locals }) => {
	const data = await request.formData()
	const address = data.get('address')
	const city = data.get('city')
	const company = data.get('company')
	const country = data.get('country')
	const email = data.get('email')
	const firstName = data.get('firstName')
	const id = data.get('id')
	const lastName = data.get('lastName')
	const locality = data.get('locality')
	const phone = data.get('phone')
	const state = data.get('state')
	const zip = data.get('zip')
	const showErrorMessage = data.get('showErrorMessage')
	const sid = cookies.get('connect.sid')

	if (showErrorMessage === true) {
		throw error(404, 'Please enter valid phone number')
	} else {
		const res = await AddressService.saveAddress({
			address,
			city,
			company,
			country,
			email,
			firstName,
			id,
			lastName,
			locality,
			phone,
			state,
			zip,
			storeId: locals.store?.id,
			sid,
			origin: locals.origin
		})

		// console.log('res of save address = ', res)

		return res
	}
}

const editAddress = async ({ request, cookies, locals }) => {
	const data = await request.formData()
	const address = data.get('address')
	const city = data.get('city')
	const company = data.get('company')
	const country = data.get('country')
	const email = data.get('email')
	const firstName = data.get('firstName')
	const id = data.get('id')
	const lastName = data.get('lastName')
	const locality = data.get('locality')
	const phone = data.get('phone')
	const state = data.get('state')
	const zip = data.get('zip')
	const sid = cookies.get('connect.sid')

	const res = await AddressService.editAddress({
		address,
		city,
		company,
		country,
		email,
		firstName,
		id,
		lastName,
		locality,
		phone,
		state,
		zip,
		storeId: locals.store?.id,
		sid,
		origin: locals.origin
	})

	// console.log('res of save address = ', res)

	return res
}

const deleteAddress = async ({ request, cookies, locals }) => {
	const data = await request.formData()
	const id = data.get('id')
	const sid = cookies.get('connect.sid')

	const res = await AddressService.deleteAddress({
		id,
		storeId: locals.store?.id,
		sid
	})

	// console.log('res of save address = ', res)

	return res
}

export const actions = { saveAddress, editAddress, deleteAddress }
