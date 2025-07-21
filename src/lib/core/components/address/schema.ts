import { z } from 'zod'

export const AddressSchema = {
	firstName: z.string().min(2, 'First name must be at least 2 characters'),
	lastName: z.string().min(2, 'Last name must be at least 2 characters'),
	phone: z.union([
    z.literal(''),
		z.string()
		.regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
		.min(9, 'Please enter a valid phone number'),
  ]),
	address_1: z.string().min(5, 'Address must be at least 5 characters'),
	city: z.string().min(2, 'City must be at least 2 characters'),
	state: z.string().min(2, 'State must be at least 2 characters'),
	countryCode: z.string().min(2, 'Country must be at least 2 characters'),
	zip: z
		.string()
		.min(1, 'Postal/ZIP code is required')
		.regex(/^[A-Z0-9]{3,10}$/i, 'Enter a valid postal/ZIP code')
}
