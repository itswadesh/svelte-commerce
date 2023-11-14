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
			megamenu: Category
			menu: [any]
			popularSearches: [any]
			store: any
			sid: string
			storeId: string
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
}
