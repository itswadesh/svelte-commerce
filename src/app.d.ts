// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			storeDetails?: any
			storeNotFound?: boolean
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
