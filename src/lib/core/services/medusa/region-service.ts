import type { Region } from '$lib/core/types'
import { ApiService } from './api-service'

export class RegionService {
	/**
	 * Get region information by region ID
	 * @param id - Region ID
	 * @returns Region details
	 */
	static async getRegionByRegionId(id: string) {
		try {
			const response = await ApiService.get<Region>(`/store/regions/${id}`)

			return response?.data
		} catch (error) {
			console.error('Error fetching region:', error?.response?.data || error?.message, 'Request Config:', error?.config)
			// Return default data on error
			return {
				id: 'error-placeholder',
				name: 'Error Region',
				currency_code: 'USD',
				countries: []
			}
		}
	}

	/**
	 * List all available regions
	 * @returns Available regions
	 */
	static async listRegions() {
		try {
			const response = await ApiService.get(`/store/regions`)

			return response?.data
		} catch (error) {
			console.error('Error fetching regions:', error?.response?.data || error?.message, 'Request Config:', error?.config)
			return {
				regions: []
			}
		}
	}
}

