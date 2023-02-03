// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		me: Me | null
		user: {
			name: string
			role: string
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
