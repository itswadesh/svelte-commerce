import { error, fail, redirect } from '@sveltejs/kit'
import { AddressService, CountryService, type Address } from '$lib/core/services'
import { z, type ZodError } from 'zod'
import type { Actions, PageServerLoad } from './$types'

type CountrySelection = {
	code?: string
	dialCode?: string
}

type AddressFormFields = {
	address: string
	city: string
	country: string
	email: string
	firstName: string
	lastName: string
	phone: string
	state: string
	zip: string
}

type HttpErrorLike = {
	message?: string
	status?: number
}

function getFormString(data: FormData, key: string): string {
	const value = data.get(key)
	return typeof value === 'string' ? value : ''
}

function parseCountrySelection(value: string): CountrySelection {
	if (!value) return {}

	try {
		const parsed = JSON.parse(value) as unknown
		return typeof parsed === 'object' && parsed !== null ? (parsed as CountrySelection) : {}
	} catch {
		return {}
	}
}

function getHttpError(errorValue: unknown): Required<HttpErrorLike> {
	if (typeof errorValue === 'object' && errorValue !== null) {
		const candidate = errorValue as HttpErrorLike
		return {
			message: candidate.message ?? 'An unknown error occurred',
			status: candidate.status ?? 500
		}
	}

	return {
		message: 'An unknown error occurred',
		status: 500
	}
}

function getFieldErrors(errorValue: unknown) {
	return (errorValue as ZodError<AddressFormFields>).flatten().fieldErrors
}

function toAddressPayload(fields: AddressFormFields): Omit<Address, 'id'> {
	return {
		active: true,
		address_1: fields.address,
		address_2: null,
		city: fields.city,
		country: fields.country,
		countryCode: null,
		createdAt: '',
		deliveryInstructions: null,
		email: fields.email,
		firstName: fields.firstName,
		isPrimary: false,
		isResidential: true,
		lastName: fields.lastName,
		lat: null,
		lng: null,
		locality: null,
		phone: fields.phone,
		state: fields.state,
		updatedAt: '',
		userId: null,
		zip: fields.zip
	}
}

export const load: PageServerLoad = async ({ locals, url, fetch }) => {
	const { me } = locals
	if (!me) {
		redirect(307, `/login?ref=${url.pathname}${url.search}`)
	}

	try {
		const countryService = new CountryService(fetch)
		const countries = await countryService.list()

		const addressService = new AddressService(fetch)
		const { data: addressList, count } = await addressService.list({})
		const addresses = Object.assign(addressList, { count })

		if (addresses) {
			return { addresses, countries }
		}
	} catch (e) {
		const caught = getHttpError(e)
		if (caught.status === 401 || caught.status === 403) {
			redirect(307, '/?show_auth=true&login=true')
		}

		error(caught.status, caught.message)
	}
}

const zodAddressSchema = z.object({
	address: z.string({ required_error: 'Address is required' }),
	city: z.string({ required_error: 'City is required' }),
	country: z.string({ required_error: 'Country is required' }),
	email: z.string({ required_error: 'Email is required' }).email({ message: 'Email must be a valid email address' }),
	firstName: z.string({ required_error: 'First Name is required' }).min(3, { message: 'First Name must be at least 3 characters' }),
	lastName: z.string({ required_error: 'Last Name is required' }).min(3, { message: 'Last Name must be at least 3 characters' }),
	phone: z
		.string({ required_error: 'Phone is required' })
		.min(9, { message: 'Please enter a valid phone number' })
		.max(17, { message: 'Please enter a valid phone number' }),
	state: z.string({ required_error: 'State is required' }),
	zip: z.string({ required_error: 'ZIP is required' })
})

const zodAddressForINSchema = z.object({
	address: z.string({ required_error: 'Address is required' }),
	city: z.string({ required_error: 'City is required' }),
	country: z.string({ required_error: 'Country is required' }),
	email: z.string({ required_error: 'Email is required' }).email({ message: 'Email must be a valid email address' }),
	firstName: z.string({ required_error: 'First Name is required' }).min(3, { message: 'First Name must be at least 3 characters' }),
	lastName: z.string({ required_error: 'Last Name is required' }).min(3, { message: 'Last Name must be at least 3 characters' }),
	phone: z
		.string({ required_error: 'Phone is required' })
		.min(9, { message: 'Please enter a valid phone number' })
		.max(17, { message: 'Please enter a valid phone number' }),
	state: z.string({ required_error: 'State is required' }),
	zip: z.string({ required_error: 'ZIP is required' }).min(6, { message: 'ZIP must be at least 6 digits.' })
})

const zodAddressForGBSchema = z.object({
	address: z.string({ required_error: 'Address is required' }),
	city: z.string({ required_error: 'City is required' }),
	country: z.string({ required_error: 'Country is required' }),
	email: z.string({ required_error: 'Email is required' }).email({ message: 'Email must be a valid email address' }),
	firstName: z.string({ required_error: 'First Name is required' }).min(3, { message: 'First Name must be at least 3 characters' }),
	lastName: z.string({ required_error: 'Last Name is required' }).min(3, { message: 'Last Name must be at least 3 characters' }),
	phone: z
		.string({ required_error: 'Phone is required' })
		.min(9, { message: 'Please enter a valid phone number' })
		.max(17, { message: 'Please enter a valid phone number' }),
	state: z.string({ required_error: 'State is required' }),
	zip: z.string({ required_error: 'ZIP is required' }).min(7, { message: 'ZIP must be at least 7 digits.' })
})

const saveAddress: Actions['saveAddress'] = async ({ request, cookies, locals, fetch }) => {
	const data = await request.formData()

	const cartId = locals?.cartId
	const isSameAsBillingAddress = getFormString(data, 'isSameAsBillingAddress')

	// for shipping address
	const id = getFormString(data, 'id')
	const showShippingAddressErrorMessage = getFormString(data, 'showShippingAddressErrorMessage')
	let selectedShippingAddressCountry = getFormString(data, 'selectedShippingAddressCountry')

	// for billing address
	const showBillingAddressErrorMessage = getFormString(data, 'showBillingAddressErrorMessage')
	let selectedBillingAddressCountry = getFormString(data, 'selectedBillingAddressCountry')

	const sid = cookies.get('connect.sid')

	const selectedShippingCountry = parseCountrySelection(selectedShippingAddressCountry)
	const selectedBillingCountry = parseCountrySelection(selectedBillingAddressCountry)

	let shipping_address: AddressFormFields = {
		address: getFormString(data, 'address'),
		city: getFormString(data, 'city'),
		country: getFormString(data, 'country'),
		email: getFormString(data, 'email'),
		firstName: getFormString(data, 'firstName'),
		lastName: getFormString(data, 'lastName'),
		phone: getFormString(data, 'phone'),
		state: getFormString(data, 'state'),
		zip: getFormString(data, 'zip')
	}

	let res = {}

	// Case 1: Logged in
	if (locals?.me) {
		if (showShippingAddressErrorMessage === 'true') {
			error(404, 'Please enter valid phone number')
		} else if (selectedShippingCountry?.code === 'IN' && shipping_address.zip.length !== 6) {
			error(404, 'Please enter 6 digit Postal Code/Pincode/Zipcode')
		} else if (selectedShippingCountry?.code === 'GB' && shipping_address.zip.length !== 7) {
			error(404, 'Please enter 7 digit Postal Code/Pincode/Zipcode')
		} else {
			if (shipping_address.phone) {
				shipping_address.phone = shipping_address.phone.replace(/[a-zA-Z ]/g, '')

				if (shipping_address.phone.startsWith('0')) {
					shipping_address.phone = shipping_address.phone.substring(1)
				}

				if (!shipping_address.phone.startsWith('+')) {
					shipping_address.phone = (selectedShippingCountry?.dialCode || '+91') + shipping_address.phone
				}
			}

			try {
				if (selectedShippingCountry?.code === 'IN') {
					zodAddressForINSchema.parse(shipping_address)
				} else if (selectedShippingCountry?.code === 'GB') {
					zodAddressForGBSchema.parse(shipping_address)
				} else {
					zodAddressSchema.parse(shipping_address)
				}
			} catch (err) {
				const errors = getFieldErrors(err)
				const { address, city, ...rest } = shipping_address
				return fail(404, {
					data: rest,
					errors
				})
			}

			try {
				const addressService = new AddressService(fetch)
				res = id
					? await addressService.editAddress(id, toAddressPayload(shipping_address))
					: await addressService.saveAddress(toAddressPayload(shipping_address))
			} catch (e) {
				return fail(404, { data: res })
			}
		}
	}

	// Case 2: Not logged in
	else {
		if (showShippingAddressErrorMessage === 'true') {
			error(404, 'Please enter valid phone number')
		} else if (selectedShippingCountry?.code === 'IN' && shipping_address.zip.length !== 6) {
			error(404, 'Please enter 6 digit Postal Code/Pincode/Zipcode')
		} else if (selectedShippingCountry?.code === 'GB' && shipping_address.zip.length !== 7) {
			error(404, 'Please enter 7 digit Postal Code/Pincode/Zipcode')
		} else {
			shipping_address.phone = shipping_address.phone.replace(/[a-zA-Z ]/g, '')

			if (shipping_address.phone.startsWith('0')) {
				shipping_address.phone = shipping_address.phone.substring(1)
			}

			if (!shipping_address.phone.startsWith('+')) {
				shipping_address.phone = (selectedShippingCountry?.dialCode || '+91') + shipping_address.phone
			}

			try {
				if (selectedShippingCountry?.code === 'IN') {
					zodAddressForINSchema.parse(shipping_address)
				} else if (selectedShippingCountry?.code === 'GB') {
					zodAddressForGBSchema.parse(shipping_address)
				} else {
					zodAddressSchema.parse(shipping_address)
				}
			} catch (err) {
				const errors = getFieldErrors(err)
				const { address, city, ...rest } = shipping_address
				return fail(404, {
					data: rest,
					errors
				})
			}

			const sameAsBilling = isSameAsBillingAddress === 'true'
			const new_billing_address: AddressFormFields = {
				address: sameAsBilling ? shipping_address.address : getFormString(data, 'billingAddressAddress'),
				city: sameAsBilling ? shipping_address.city : getFormString(data, 'billingAddressCity'),
				country: sameAsBilling ? shipping_address.country : getFormString(data, 'billingAddressCountry'),
				email: sameAsBilling ? shipping_address.email : getFormString(data, 'billingAddressEmail'),
				firstName: sameAsBilling ? shipping_address.firstName : getFormString(data, 'billingAddressFirstName'),
				lastName: sameAsBilling ? shipping_address.lastName : getFormString(data, 'billingAddressLastName'),
				phone: sameAsBilling ? shipping_address.phone : getFormString(data, 'billingAddressPhone'),
				state: sameAsBilling ? shipping_address.state : getFormString(data, 'billingAddressState'),
				zip: sameAsBilling ? shipping_address.zip : getFormString(data, 'billingAddressZip')
			}

			if (new_billing_address && new_billing_address?.firstName && new_billing_address?.zip) {
				if (showBillingAddressErrorMessage === 'true') {
					error(404, 'Please enter valid phone number')
				} else if (selectedBillingCountry?.code === 'IN' && new_billing_address.zip.length !== 6) {
					error(404, 'Please enter 6 digit Postal Code/Pincode/Zipcode')
				} else if (selectedBillingCountry?.code === 'GB' && new_billing_address.zip.length !== 7) {
					error(404, 'Please enter 7 digit Postal Code/Pincode/Zipcode')
				} else {
					if (new_billing_address?.phone) {
						new_billing_address.phone = new_billing_address.phone.replace(/[a-zA-Z ]/g, '')

						if (new_billing_address.phone.startsWith('0')) {
							new_billing_address.phone = new_billing_address.phone.substring(1)
						}

						if (!new_billing_address.phone.startsWith('+')) {
							new_billing_address.phone = (selectedBillingCountry?.dialCode || '+91') + new_billing_address.phone
						}
					}

					try {
						if (selectedBillingCountry?.code === 'IN') {
							zodAddressForINSchema.parse(new_billing_address)
						} else if (selectedBillingCountry?.code === 'GB') {
							zodAddressForGBSchema.parse(new_billing_address)
						} else {
							zodAddressSchema.parse(new_billing_address)
						}
					} catch (err) {
						const errors = getFieldErrors(err)
						const { address, city, ...rest } = new_billing_address
						return fail(404, {
							data: rest,
							billing_errors: errors
						})
					}
				}
			}

			// try {
			//     res = await CartService.updateCart3({
			//         cartId,
			//         shipping_address,
			//         billing_address: new_billing_address,
			//         selfTakeout: false,
			//         storeId: locals.storeId,
			//         sid,
			//         origin: locals?.origin
			//     })
			// } catch (e) {
			//     error(404, { data: res })
			// }
		}
	}

	// Return the response

	return res
}

const editAddress: Actions['editAddress'] = async ({ request, cookies, locals, fetch }) => {
	const data = await request.formData()

	const id = getFormString(data, 'id')
	const showShippingAddressErrorMessage = getFormString(data, 'showShippingAddressErrorMessage')
	let selectedShippingAddressCountry = parseCountrySelection(getFormString(data, 'selectedShippingAddressCountry'))

	const sid = cookies.get('connect.sid')

	let formData: AddressFormFields = {
		address: getFormString(data, 'address'),
		city: getFormString(data, 'city'),
		country: getFormString(data, 'country'),
		email: getFormString(data, 'email'),
		firstName: getFormString(data, 'firstName'),
		lastName: getFormString(data, 'lastName'),
		phone: getFormString(data, 'phone'),
		state: getFormString(data, 'state'),
		zip: getFormString(data, 'zip')
	}

	if (showShippingAddressErrorMessage === 'true') {
		error(404, 'Please enter valid phone number')
	} else if (selectedShippingAddressCountry?.code === 'IN' && formData.zip.length !== 6) {
		error(404, 'Please enter 6 digit Postal Code/Pincode/Zipcode')
	} else if (selectedShippingAddressCountry?.code === 'GB' && formData.zip.length !== 7) {
		error(404, 'Please enter 7 digit Postal Code/Pincode/Zipcode')
	} else {
		if (formData.phone) {
			formData.phone = formData.phone.replace(/[a-zA-Z ]/g, '')

			if (formData.phone.startsWith('0')) {
				formData.phone = formData.phone.substring(1)
			}

			if (!formData.phone.startsWith('+')) {
				formData.phone = (selectedShippingAddressCountry?.dialCode || '+91') + formData.phone
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
			const errors = getFieldErrors(err)
			const { address, city, ...rest } = formData
			return fail(404, {
				data: rest,
				errors
			})
		}
		try {
			const addressService = new AddressService(fetch)
			const res = id
				? await addressService.editAddress(id, toAddressPayload(formData))
				: await addressService.saveAddress(toAddressPayload(formData))

			return res
		} catch (e) {
			console.log('e', e)
			return null
		}
	}
}

const deleteAddress: Actions['deleteAddress'] = async ({ request, cookies, locals, fetch }) => {
	// if (confirm('Are you sure to delete?')) {
	const data = await request.formData()
	const id = getFormString(data, 'id')
	const sid = cookies.get('connect.sid')
	try {
		const addressService = new AddressService(fetch)
		const res = await addressService.deleteAddress(id)

		return res
	} catch (e) {
		console.log('e', e)
		return null
	}
}

export const actions = { saveAddress, editAddress, deleteAddress }
