import type { Currency, PaginatedResponse } from '$lib/core/types'
import { ApiService } from './api-service'

export class CurrencyService {
	static async listCurrencies() {
		const response = await ApiService.get<{ currencies: Currency[] }>('/store/currencies')
		return {
			data: response.data.currencies || [],
			count: response.data.currencies?.length || 0
		}
	}

	static async getCurrency(code: string) {
		const response = await ApiService.get<{ currency: Currency }>(`/store/currencies/${code}`)
		return response.data.currency
	}
}

