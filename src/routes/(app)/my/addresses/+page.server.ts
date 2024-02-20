import { AddressService, CartService } from '$lib/services'
import { error } from '@sveltejs/kit'
import { services } from '@misiki/litekart-utils'
import { z } from 'zod'

export async function load({ cookies, locals }) {
	const countries = await services.CountryService.fetchCountries({
		origin: locals.origin,
		sid: cookies.get('connect.sid'),
		storeId: locals.storeId
	})

	const { myAddresses, count } = await services.AddressService.fetchAddresses({
		origin: locals.origin,
		sid: cookies.get('connect.sid'),
		storeId: locals.storeId
	})

	myAddresses.count = count

	if (myAddresses) {
		return { addresses: myAddresses, countries }
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

})

const zodAddressForINSchema = z.object({
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

const zodAddressForGBSchema = z.object({
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
		.min(7, { message: 'ZIP must be at least 7 digits.' })
})

const saveAddress = async ({ request, cookies, locals }) => {
	const data = await request.formData()

	const cartId = locals?.cartId
	const isSameAsBillingAddress = data.get('isSameAsBillingAddress')

	// for shipping address
	const address = data.get('address')
	const city = data.get('city')
	const country = data.get('country')
	const email = data.get('email')
	const firstName = data.get('firstName')
	const id = data.get('id')
	const lastName = data.get('lastName')
	const phone = data.get('phone')
	const showShippingAddressErrorMessage = data.get('showShippingAddressErrorMessage')
	const state = data.get('state')
	const zip = data.get('zip')
	let selectedShippingAddressCountry = data.get('selectedShippingAddressCountry')

	// for billing address
	const billingAddressAddress = data.get('billingAddressAddress')
	const billingAddressCity = data.get('billingAddressCity')
	const billingAddressCountry = data.get('billingAddressCountry')
	const billingAddressEmail = data.get('billingAddressEmail')
	const billingAddressFirstName = data.get('billingAddressFirstName')
	const billingAddressLastName = data.get('billingAddressLastName')
	const billingAddressPhone = data.get('billingAddressPhone')
	const billingAddressState = data.get('billingAddressState')
	const billingAddressZip = data.get('billingAddressZip')
	const showBillingAddressErrorMessage = data.get('showBillingAddressErrorMessage')
	let selectedBillingAddressCountry = data.get('selectedBillingAddressCountry')

	const sid = cookies.get('connect.sid')

	selectedShippingAddressCountry = JSON.parse(selectedShippingAddressCountry)
	selectedBillingAddressCountry = JSON.parse(selectedBillingAddressCountry)

	let shipping_address = {
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

	// Case 1: Logged in
	if (locals?.me) {
		// console.log('showShippingAddressErrorMessage at save address', firstName)

		if (showShippingAddressErrorMessage === true || showShippingAddressErrorMessage === 'true') {
			error(404, 'Please enter valid phone number')
		} else if (selectedShippingAddressCountry?.code === 'IN' && zip.length !== 6) {
			error(404, 'Please enter 6 digit Postal Code/Pincode/Zipcode')
		} else if (selectedShippingAddressCountry?.code === 'GB' && zip.length !== 7) {
			error(404, 'Please enter 7 digit Postal Code/Pincode/Zipcode')
		} else {
			if (shipping_address.phone) {
				shipping_address.phone = shipping_address.phone.replace(/[a-zA-Z ]/g, '')

				if (shipping_address.phone.startsWith('0')) {
					shipping_address.phone = shipping_address.phone.substring(1)
				}

				if (!shipping_address.phone.startsWith('+')) {
					shipping_address.phone = (selectedShippingAddressCountry?.dialCode || '+91') + shipping_address.phone
				}
			}

			try {
				if (selectedShippingAddressCountry?.code === 'IN') {
					zodAddressForINSchema.parse(shipping_address)
				} else if (selectedShippingAddressCountry?.code === 'GB') {
					zodAddressForGBSchema.parse(shipping_address)
				} else {
					zodAddressSchema.parse(shipping_address)
				}
			} catch (err) {
				const { fieldErrors: errors } = err.flatten()
				const { address, city, ...rest } = shipping_address
				error(404, {
					data: rest,
					errors
				})
			}

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
		}
	}

	// Case 2: Not logged in
	else {
		if (showShippingAddressErrorMessage === true || showShippingAddressErrorMessage === 'true') {
			error(404, 'Please enter valid phone number')
		} else if (selectedShippingAddressCountry?.code === 'IN' && zip.length !== 6) {
			error(404, 'Please enter 6 digit Postal Code/Pincode/Zipcode')
		} else if (selectedShippingAddressCountry?.code === 'GB' && zip.length !== 7) {
			error(404, 'Please enter 7 digit Postal Code/Pincode/Zipcode')
		} else {
			shipping_address.phone = shipping_address.phone.replace(/[a-zA-Z ]/g, '')

			if (shipping_address.phone.startsWith('0')) {
				shipping_address.phone = shipping_address.phone.substring(1)
			}

			if (!shipping_address.phone.startsWith('+')) {
				shipping_address.phone = (selectedShippingAddressCountry?.dialCode || '+91') + shipping_address.phone
			}

			try {
				if (selectedShippingAddressCountry?.code === 'IN') {
					zodAddressForINSchema.parse(shipping_address)
				} else if (selectedShippingAddressCountry?.code === 'GB') {
					zodAddressForGBSchema.parse(shipping_address)
				} else {
					zodAddressSchema.parse(shipping_address)
				}
			} catch (err) {
				const { fieldErrors: errors } = err.flatten()
				const { address, city, ...rest } = shipping_address
				error(404, {
					data: rest,
					errors
				})
			}

			const new_billing_address = {
				address: isSameAsBillingAddress ? address : billingAddressAddress,
				city: isSameAsBillingAddress ? city : billingAddressCity,
				country: isSameAsBillingAddress ? country : billingAddressCountry,
				email: isSameAsBillingAddress ? email : billingAddressEmail,
				firstName: isSameAsBillingAddress ? firstName : billingAddressFirstName,
				lastName: isSameAsBillingAddress ? lastName : billingAddressLastName,
				phone: isSameAsBillingAddress ? phone : billingAddressPhone,
				state: isSameAsBillingAddress ? state : billingAddressState,
				zip: isSameAsBillingAddress ? zip : billingAddressZip
			}

			// console.log('new_billing_address', new_billing_address);

			if (new_billing_address && new_billing_address?.firstName && new_billing_address?.zip) {
				if (showBillingAddressErrorMessage === true || showBillingAddressErrorMessage === 'true') {
					error(404, 'Please enter valid phone number')
				} else if (selectedBillingAddressCountry?.code === 'IN' && zip.length !== 6) {
					error(404, 'Please enter 6 digit Postal Code/Pincode/Zipcode')
				} else if (selectedBillingAddressCountry?.code === 'GB' && zip.length !== 7) {
					error(404, 'Please enter 7 digit Postal Code/Pincode/Zipcode')
				} else {
					if (new_billing_address?.phone) {
						new_billing_address.phone = new_billing_address.phone.replace(/[a-zA-Z ]/g, '')

						if (new_billing_address.phone.startsWith('0')) {
							new_billing_address.phone = new_billing_address.phone.substring(1)
						}

						if (!new_billing_address.phone.startsWith('+')) {
							new_billing_address.phone = (selectedBillingAddressCountry?.dialCode || '+91') + new_billing_address.phone
						}
					}

					try {
						if (selectedBillingAddressCountry?.code === 'IN') {
							zodAddressForINSchema.parse(new_billing_address)
						} else if (selectedBillingAddressCountry?.code === 'GB') {
							zodAddressForGBSchema.parse(new_billing_address)
						} else {
							zodAddressSchema.parse(new_billing_address)
						}
					} catch (err) {
						const { fieldErrors: errors } = err.flatten()
						const { address, city, ...rest } = new_billing_address
						error(404, {
							data: rest,
							billing_errors: errors
						})
					}
				}
			}

			res = await CartService.updateCart3({
				cartId,
				shipping_address,
				billing_address: new_billing_address,
				selfTakeout: false,
				storeId: locals.storeId,
				sid,
				origin: locals?.origin
			})

			// console.log('res of save address = ', res)
		}
	}

	// Return the response

	return res
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
	const showShippingAddressErrorMessage = data.get('showShippingAddressErrorMessage')
	const state = data.get('state')
	const zip = data.get('zip')
	let phone = data.get('phone')
	let selectedShippingAddressCountry = data.get('selectedShippingAddressCountry')

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

	// console.log('showShippingAddressErrorMessage at edit address', showShippingAddressErrorMessage);

	if (showShippingAddressErrorMessage === true || showShippingAddressErrorMessage === 'true') {
		error(404, 'Please enter valid phone number')
	} else if (selectedShippingAddressCountry?.code === 'IN' && zip.length !== 6) {
		error(404, 'Please enter 6 digit Postal Code/Pincode/Zipcode')
	} else if (selectedShippingAddressCountry?.code === 'GB' && zip.length !== 7) {
		error(404, 'Please enter 7 digit Postal Code/Pincode/Zipcode')
	} else {
		if (phone) {
			phone = phone.replace(/[a-zA-Z ]/g, '')

			if (phone.startsWith('0')) {
				phone = phone.substring(1)
			}

			if (!phone.startsWith('+')) {
				phone = (selectedShippingAddressCountry?.dialCode || '+91') + phone
			}
		}

		try {
			if (selectedShippingAddressCountry?.code === 'IN') {
				zodAddressForINSchema.parse(formData)
			} else if (selectedShippingAddressCountry?.code === 'GB') {
				zodAddressForGBSchema.parse(formData)
			} else {
				zodAddressSchema.parse(formData)
			}
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
	// if (confirm('Are you sure to delete?')) {
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
	// } else {
	// 	return
	// }
}

export const actions = { saveAddress, editAddress, deleteAddress }
