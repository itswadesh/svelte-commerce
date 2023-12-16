import { AddressService, CartService } from '$lib/services'
import { error } from '@sveltejs/kit'
import { z } from 'zod'

export async function load({ cookies, locals }) {
	const { myAddresses, selectedAddress, count } = await AddressService.fetchAddresses({
		storeId: locals.storeId,
		server: true,
		sid: cookies.get('connect.sid')
	})

	myAddresses.count = count

	if (myAddresses) {
		return { addresses: myAddresses, selectedAddress }
	}

	error(404, 'Addresses not found')
}

const zodAddressSchema = z.object({
	address: z.string({ required_error: 'Address is required' }),
	city: z.string({ required_error: 'City is required' }),
	country: z.string({ required_error: 'Country is required' }),
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email address' }),
	firstName: z
		.string({ required_error: 'First Name is required' })
		.min(3, { message: 'First Name must be at least 3 characters' }),
	lastName: z
		.string({ required_error: 'Last Name is required' })
		.min(3, { message: 'Last Name must be at least 3 characters' }),
	phone: z
		.string({ required_error: 'Phone is required' })
		.min(10, { message: 'Phone must be at least 10 digits' })
		.max(17, { message: 'Phone must be less then 17 digits' }),
	state: z.string({ required_error: 'State is required' }),
	zip: z
		.string({ required_error: 'ZIP is required' })
		.min(6, { message: 'ZIP must be at least 6 digits.' })
})

const saveAddress = async ({ request, cookies, locals }) => {
	const data = await request.formData()

	const address = data.get('address')
	const city = data.get('city')
	const cartId = locals?.cartId
	const country = data.get('country')
	const email = data.get('email')
	const firstName = data.get('firstName')
	const id = data.get('id')
	const lastName = data.get('lastName')
	const selectedCountry = data.get('selectedCountry')
	const showErrorMessage = data.get('showErrorMessage')
	const state = data.get('state')
	const zip = data.get('zip')
	let phone = data.get('phone')

	const sid = cookies.get('connect.sid')

	let formData = {
		address: address,
		city: city,
		country: country,
		email: email,
		firstName: firstName,
		lastName: lastName,
		phone: phone,
		state: state,
		zip: zip
	}

	let res = {}

	// console.log('showErrorMessage at save address', firstName)

	if (showErrorMessage === true || showErrorMessage === 'true') {
		error(404, 'Please enter valid phone number')
	} else if (zip.length !== 6) {
		error(404, 'Please enter 6 digit Postal Code/Pincode/Zipcode')
	} else {
		phone = phone.replace(/[a-zA-Z ]/g, '')

		if (phone.startsWith('0')) {
			phone = phone.substring(1)
		}

		if (!phone.startsWith('+')) {
			phone = (selectedCountry[0].dialCode || '+91') + phone
		}

		try {
			zodAddressSchema.parse(formData)
		} catch (err) {
			const { fieldErrors: errors } = err.flatten()
			const { address, city, ...rest } = formData
			error(404, {
				data: rest,
				errors
			})
		}

		if (locals?.me) {
			res = await AddressService.saveAddress({
				address,
				city,
				country,
				email,
				firstName,
				id,
				lastName,
				phone,
				state,
				zip,
				storeId: locals.storeId,
				sid,
				origin: locals?.origin
			})
		} else {
			res = await CartService.updateCartWithoutLogIn({
				cartId,
				address,
				city,
				country,
				email,
				firstName,
				lastName,
				phone,
				state,
				zip,
				selfTakeout: false,
				storeId: locals.storeId,
				sid,
				origin: locals?.origin
			})
		}

		// console.log('res of save address = ', res)

		return res
	}
}

const editAddress = async ({ request, cookies, locals }) => {
	const data = await request.formData()

	const address = data.get('address')
	const city = data.get('city')
	const country = data.get('country')
	const email = data.get('email')
	const firstName = data.get('firstName')
	const id = data.get('id')
	const lastName = data.get('lastName')
	const selectedCountry = data.get('selectedCountry')
	const showErrorMessage = data.get('showErrorMessage')
	const state = data.get('state')
	const zip = data.get('zip')
	let phone = data.get('phone')

	const sid = cookies.get('connect.sid')

	let formData = {
		address: address,
		city: city,
		country: country,
		email: email,
		firstName: firstName,
		lastName: lastName,
		phone: phone,
		state: state,
		zip: zip
	}

	// console.log('showErrorMessage at edit address', showErrorMessage);

	if (showErrorMessage === true || showErrorMessage === 'true') {
		error(404, 'Please enter valid phone number')
	} else if (zip.length !== 6) {
		error(404, 'Please enter 6 digit Postal Code/Pincode/Zipcode')
	} else {
		phone = phone.replace(/[a-zA-Z ]/g, '')

		if (phone.startsWith('0')) {
			phone = phone.substring(1)
		}

		if (!phone.startsWith('+')) {
			phone = (selectedCountry[0].dialCode || '+91') + phone
		}

		try {
			zodAddressSchema.parse(formData)
		} catch (err) {
			const { fieldErrors: errors } = err.flatten()
			const { address, city, ...rest } = formData
			error(404, {
				data: rest,
				errors
			})
		}

		const res = await AddressService.saveAddress({
			address,
			city,
			country,
			email,
			firstName,
			id,
			lastName,
			phone,
			state,
			zip,
			storeId: locals.storeId,
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
		storeId: locals.storeId,
		sid
	})

	// console.log('res of save address = ', res)

	return res
}

export const actions = { saveAddress, editAddress, deleteAddress }
