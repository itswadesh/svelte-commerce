import type { User } from '$lib/core/types'
import { ApiService } from './api-service'

export class ProfileService {
	static async getOne() {
		return ApiService.get<User>('/store/customers/me')
	}

	static async save(profile: Omit<User, 'id'>) {
		return ApiService.post<User>('/store/customers/me', profile)
	}

	static async getAddresses() {
		return ApiService.get('/store/customers/me/addresses')
	}

	static async addAddress(address: any) {
		return ApiService.post('/store/customers/me/addresses', address)
	}

	static async updateAddress(addressId: string, address: any) {
		return ApiService.post(`/store/customers/me/addresses/${addressId}`, address)
	}

	static async deleteAddress(addressId: string) {
		return ApiService.delete(`/store/customers/me/addresses/${addressId}`)
	}

	static async register(customerData: any) {
		return ApiService.post('/store/customers', customerData)
	}

	static async getAddress(addressId: string) {
		return ApiService.get(`/store/customers/me/addresses/${addressId}`)
	}
}

