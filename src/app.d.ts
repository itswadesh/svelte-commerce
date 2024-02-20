// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Me, Cart, Category } from '$lib/types'

// and what to do when importing types
declare global {
	namespace App {
		interface Locals {
			me: Me | null
			q: string
			sid: string
			url: string
			zip: string
			currentPage: number
			user: {
				name: string
				role: string
			}
			cart: Cart
			cartId: string
			cartQty: number
			host: string
			isDesktop: boolean
			isShowBackButton: boolean
			megamenu: Category
			menu: [any]
			origin: string
			popularSearches: [any]
			session: string
			sid: string
			store: any
			storeId: string
			zip: string
		}
		// interface PageData {}

		// interface Platform {}
	}
}
