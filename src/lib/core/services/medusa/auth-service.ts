import type { User, verifyEmail } from '$lib/core/types'
import { ApiService } from './api-service'

export class AuthService {
	static async getMe() {
		return ApiService.get<User>('/store/customers/me')
	}

	static async get(id: string) {
		return ApiService.get<User>(`/store/customers/${id}`)
	}

	static async verifyEmail(email: string, token: string) {
		return ApiService.post<verifyEmail>('/auth/customer/email/verify', {
			email,
			token
		})
	}

	static async signup({
		firstName,
		lastName,
		phone,
		email,
		password,
		passwordConfirmation,
		cartId = null
	}: {
		firstName: string
		lastName: string
		phone: string
		email: string
		password: string
		passwordConfirmation: string
		cartId?: string | null
	}) {
		const payload = {
			first_name: firstName,
			last_name: lastName,
			email,
			password,
			phone
		}

		const response = await ApiService.post<User>('/store/customers', payload)

		// If cartId exists, associate the cart with the new customer

		return response
	}

	static async joinAsVendor({
		firstName,
		lastName,
		businessName,
		phone,
		email,
		password,

		role,
		origin
	}: {
		firstName: string
		lastName: string
		businessName: string
		phone: string
		email: string
		password: string
		role: string
		origin: string
	}) {
		// Note: Medusa might not have a direct equivalent for vendor registration
		// This implementation assumes a custom endpoint would be added in Medusa
		return ApiService.post<User>('/auth/customer/email/register', {
			first_name: firstName,
			last_name: lastName,
			business_name: businessName,
			phone,
			email,
			password,
			role,
			origin
		})
	}

	static async joinAsAdmin({
		firstName,
		lastName,
		businessName,
		phone,
		email,
		password,
		origin
	}: {
		firstName: string
		lastName: string
		businessName: string
		phone: string
		email: string
		password: string
		origin: string
	}) {
		// Note: Medusa separates admin APIs, this would typically be handled differently
		// For consistency with the original function, we'll keep it but note the limitation
		return ApiService.post<User>('/admin/auth/register', {
			first_name: firstName,
			last_name: lastName,
			business_name: businessName,
			phone,
			email,
			password,
			origin
		})
	}

	static async login({ email, password, cartId = null }: { email: string; password: string; cartId?: string | null }) {
		const response = await ApiService.post<User>('/auth/session', {
			email,
			password
		})

		return response
	}

	static async forgotPassword({ email, referrer }: { email: string; referrer: string }) {
		return ApiService.post<User>('/auth/customer/email/reset-password', {
			email,
			referrer
		})
	}

	static async changePassword(body: { old: string; password: string }) {
		return ApiService.post<User>('/auth/customer/email/update', {
			old_password: body.old,
			new_password: body.password
		})
	}

	static async resetPassword({ userId, token, password }: { userId: string; token: string; password: string }) {
		return ApiService.post<User>('/auth/customer/email/reset-password', {
			token,
			password
		})
	}

	static async getOtp({ phone }: { phone: string }) {
		// Note: Standard Medusa doesn't have OTP functionality
		// This would be a custom implementation
		return ApiService.post<User>('/auth/customer/phone/otp', { phone })
	}

	static async verifyOtp({ phone, otp }: { phone: string; otp: string }) {
		// Note: Standard Medusa doesn't have OTP functionality
		// This would be a custom implementation
		return ApiService.post<User>('/auth/customer/phone/verify', { phone, otp })
	}

	static async logout() {
		return ApiService.delete('/auth/session')
	}

	static async updateProfile({
		id,
		firstName,
		lastName,
		email,
		phone,
		avatar
	}: {
		id: string
		firstName: string
		lastName: string
		email: string
		phone: string
		avatar?: string
	}) {
		return ApiService.post('/auth/customer/email/update', {
			first_name: firstName,
			last_name: lastName,
			email,
			phone,
			avatar
		})
	}
}

