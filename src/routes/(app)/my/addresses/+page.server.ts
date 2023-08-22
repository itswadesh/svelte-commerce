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
	const selectedCountry = data.get('selectedCountry')
	const showErrorMessage = data.get('showErrorMessage')
	const state = data.get('state')
	const zip = data.get('zip')
	let phone = data.get('phone')

	const sid = cookies.get('connect.sid')

	// console.log('showErrorMessage at save address', showErrorMessage);

	if (showErrorMessage === true || showErrorMessage === 'true') {
		throw error(404, 'Please enter valid phone number')
	} else {
		phone = phone.replace(/[a-zA-Z ]/g, '')

		if (phone.startsWith('0')) {
			phone = phone.substring(1)
		}

		if (!phone.startsWith('+')) {
			phone = (selectedCountry[0].dialCode || '+91') + phone
		}

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
			origin: locals?.origin
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
	const selectedCountry = data.get('selectedCountry')
	const showErrorMessage = data.get('showErrorMessage')
	const state = data.get('state')
	const zip = data.get('zip')
	let phone = data.get('phone')

	const sid = cookies.get('connect.sid')

	// console.log('showErrorMessage at edit address', showErrorMessage);

	if (showErrorMessage === true || showErrorMessage === 'true') {
		throw error(404, 'Please enter valid phone number')
	} else {
		phone = phone.replace(/[a-zA-Z ]/g, '')

		console.log(phone)

		if (phone.startsWith('0')) {
			phone = phone.substring(1)
		}

		if (!phone.startsWith('+')) {
			phone = (selectedCountry[0].dialCode || '+91') + phone
		}

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
			origin: locals?.origin
		})

		// console.log('res of save address = ', res)

		return res
	}
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
