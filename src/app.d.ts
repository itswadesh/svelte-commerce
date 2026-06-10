import type { Store, User } from '$lib/core/services'

declare global {
	namespace App {
		interface Error {
			message: string
			status?: number
		}
		interface Locals {
			cartId?: string
			me?: User | null
			origin?: string
			storeDetails?: Store
			storeId?: string
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
