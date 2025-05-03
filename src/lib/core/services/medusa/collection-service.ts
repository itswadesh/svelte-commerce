import type { Collection, PaginatedResponse } from '$lib/core/types'
import { ApiService } from './api-service'

export class CollectionService {
	static async list({ page = 1, limit = 10, q = '', sort = '-created_at' }) {
		return ApiService.get<PaginatedResponse<Collection>>(`/store/collections?&limit=${limit}&q=${q}`)
	}

	static async getOne(id: string) {
		return ApiService.get<Collection>(`/store/collections/${id}`)
	}

	static async getProducts(collectionId: string, { page = 1, limit = 10 } = {}) {
		return ApiService.get(`/store/collections/${collectionId}/products?page=${page}&limit=${limit}`)
	}
}

