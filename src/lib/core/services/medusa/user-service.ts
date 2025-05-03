import type { User } from '$lib/core/types'
import { ApiService } from './api-service'

export class UserService {
	// Get current authenticated user (admin)
	static async getMe() {
		return ApiService.get<User>('/admin/users/me')
	}

	// Get specific user by ID (admin only)
	static async get(id: string) {
		return ApiService.get<User>(`/admin/users/${id}`)
	}

	// Customer registration
	static async signup({
		firstName,
		lastName,
		phone,
		email,
		password,
		cartId = null
	}: {
		firstName: string
		lastName: string
		phone: string
		email: string
		password: string
		cartId?: string | null
	}) {
		try {
			return ApiService.post<User>('/auth/customer/emailpass/register', {
				first_name: firstName,
				last_name: lastName,
				phone,
				email,
				password,
				cart_id: cartId
			})
		} catch (e: unknown) {
			const errorMessage = e instanceof Error ? e.message : 'Failed to signup'
			throw new Error(errorMessage)
		}
	}

	// Admin user creation (typically done through invites)
	static async createAdminUser({ firstName, lastName, email }: { firstName: string; lastName: string; email: string }) {
		return ApiService.post<User>('/admin/users', {
			first_name: firstName,
			last_name: lastName,
			email
		})
	}

	// Login for customer
	static async customerLogin({ email, password, cartId = null }: { email: string; password: string; cartId?: string | null }) {
		return ApiService.post<{ user: User }>('/auth/customer/emailpass', {
			email,
			password,
			cart_id: cartId
		})
	}

	// Login for admin user
	static async adminLogin({ email, password }: { email: string; password: string }) {
		return ApiService.post<{ user: User }>('/auth/user/emailpass', {
			email,
			password
		})
	}

	// Forgot password (customer)
	static async forgotCustomerPassword(email: string) {
		return ApiService.post<void>('/auth/customer/emailpass/reset-password', {
			email
		})
	}

	// Forgot password (admin)
	static async forgotAdminPassword(email: string) {
		return ApiService.post<void>('/auth/user/emailpass/reset-password', {
			email
		})
	}

	// Reset password (customer)
	static async resetCustomerPassword({ token, email, password }: { token: string; email: string; password: string }) {
		return ApiService.post<User>('/auth/customer/emailpass/update', {
			token,
			email,
			password
		})
	}

	// Reset password (admin)
	static async resetAdminPassword({ token, email, password }: { token: string; email: string; password: string }) {
		return ApiService.post<User>('/auth/user/emailpass/update', {
			token,
			email,
			password
		})
	}

	// Logout (handled client-side in Medusa by removing the auth token)
	static async logout() {
		return Promise.resolve()
	}

	// Update user profile (admin)
	static async updateProfile({
		id,
		firstName,
		lastName,
		email,
		phone
	}: {
		id: string
		firstName: string
		lastName: string
		email: string
		phone: string
	}) {
		return ApiService.put<User>(`/admin/users/${id}`, {
			first_name: firstName,
			last_name: lastName,
			email,
			phone
		})
	}

	// Check if email exists (customer)
	static async checkCustomerEmail(email: string) {
		try {
			return ApiService.post<{ exists: boolean }>('/auth/customer/emailpass/exists', { email })
		} catch (e) {
			throw new Error(e?.message || 'Failed to check email')
		}
	}

	// Delete user (admin)
	static async deleteUser(id: string) {
		return ApiService.delete<User>(`/admin/users/${id}`)
	}

	// Invite admin user
	static async inviteUser(email: string) {
		return ApiService.post<User>('/admin/users/invite', {
			email
		})
	}

	// Accept admin invite
	static async acceptInvite({
		token,
		user
	}: {
		token: string
		user: {
			first_name: string
			last_name: string
			password: string
		}
	}) {
		return ApiService.post<User>('/admin/users/invite/accept', {
			token,
			user
		})
	}
}

