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
		me: {
			active: boolean
			avatar: string
			email: string
			firstName: string
			lastName: string
			phone: string
			role: string
			verified: boolean
		}
		cart: any
		megamenu: any
		store: any
		session: string
		origin: string
		zip: string
		cartId: string
		cartQty: number
		isDesktop: boolean
		isShowBackButton: boolean
	}

	// interface PageData {}

	// interface Platform {}
}
