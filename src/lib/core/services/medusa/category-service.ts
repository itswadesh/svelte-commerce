import type { Category, PaginatedResponse } from '$lib/core/types'
import { ApiService } from './api-service'

export class CategoryService {
	// For storefront (public access)
	static async fetchFooterCategories({
		page = 1,
		q = '',
		sort = '-created_at',
		limit = 20
	}: {
		page?: number
		q?: string
		sort?: string
		limit?: number
	}) {
		const offset = (page - 1) * limit
		return ApiService.get<PaginatedResponse<Category>>(`/store/product-categories?limit=${limit}&offset=${offset}&q=${q}&order=${sort}`)
	}

	// For storefront (public access)
	static async fetchFeaturedCategories({ limit = 100 }: { limit?: number }) {
		return ApiService.get<PaginatedResponse<Category>>(`/store/product-categories?limit=${limit}&is_featured=true`)
	}

	// For storefront (public access)
	static async fetchCategory(id: string) {
		return ApiService.get<Category>(`/store/product-categories/${id}`)
	}

	// For storefront (public access)
	static async fetchAllCategories({ limit = 100 }: { limit?: number }) {
		return ApiService.get<PaginatedResponse<Category>>(`/store/product-categories?limit=${limit}&expand=products`)
	}

	// For storefront (public access)
	static async fetchAllProductsOfCategory(id: string) {
		return ApiService.get<Category>(`/store/product-categories/${id}?expand=products`)
	}

	// For storefront (public access)
	static async getMegamenu() {
		return ApiService.get<PaginatedResponse<Category>>('/store/product-categories?parent_category_id=null&include_descendants_tree=true')
	}

	// ADMIN-ONLY METHODS

	// For admin dashboard
	static async listAdminCategories({
		page = 1,
		q = '',
		sort = '-created_at',
		limit = 20
	}: {
		page?: number
		q?: string
		sort?: string
		limit?: number
	}) {
		const offset = (page - 1) * limit
		return ApiService.get<PaginatedResponse<Category>>(`/admin/product-categories?limit=${limit}&offset=${offset}&q=${q}&order=${sort}`)
	}

	// For admin dashboard
	static async createCategory(payload: {
		name: string
		description?: string
		parent_category_id?: string
		is_internal?: boolean
		is_active?: boolean
	}) {
		return ApiService.post<Category>('/admin/product-categories', payload)
	}

	// For admin dashboard
	static async updateCategory(
		id: string,
		payload: Partial<{
			name: string
			description: string
			parent_category_id: string
			is_internal: boolean
			is_active: boolean
		}>
	) {
		return ApiService.post<Category>(`/admin/product-categories/${id}`, payload)
	}

	// For admin dashboard
	static async deleteCategory(id: string) {
		return ApiService.delete<{
			id: string
			object: 'product-category'
			deleted: boolean
		}>(`/admin/product-categories/${id}`)
	}
}

