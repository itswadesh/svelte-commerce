// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		me: {
			email: string
			phone: string
			firstName: string
			lastName: string
			avatar: string
			role: string
			verified: string
			active: string
		}
		user: {
			name: string
			role: string
		}
		cart: any
		megamenu: any
		store: any
		session: string
	}

	// interface PageData {}

	// interface Platform {}
}
