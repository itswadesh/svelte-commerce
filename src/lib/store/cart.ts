import { CartService } from '$lib/services'
import { writable } from 'svelte/store'

export const cartStore = writable({})

let loadingForCart = false

export const getCartFromStore = async ({ origin, storeId, cartId, forceUpdate = false }) => {
	let existingCart

	cartStore.subscribe((value) => {
		if (value && Object.values(value)?.length) {
			existingCart = value
		}
	})

	if ((!loadingForCart && !existingCart) || !!forceUpdate) {
		loadingForCart = true

		const cartDataFromServer = await CartService.fetchRefreshCart({ cartId, storeId, origin })

		cartStore.update((u) => cartDataFromServer)

		loadingForCart = false
	}

	return existingCart
}

export const updateCartStore = async ({ data }) => {
	cartStore.update((u) => data)
	return true
}
