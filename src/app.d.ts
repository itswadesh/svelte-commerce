// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { StoreDetails } from '$lib/core/types'

declare global {
	namespace App {
		// `handleError` in hooks.server.ts returns a status alongside the message, so widen the
		// default `App.Error` ({ message: string }) to carry it.
		interface Error {
			message: string
			status?: number
		}
		interface Locals {
			// Set in hooks.server.ts from storeService.getStoreByIdOrDomain(), which returns StoreDetails.
			storeDetails?: StoreDetails
			storeNotFound?: boolean
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
