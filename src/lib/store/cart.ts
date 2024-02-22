import { CartService } from '$lib/services'
import { writable } from 'svelte/store'

export const cartStore = writable({})
export const cartLoadingStore = writable(false)

let loadingForCart = false

export const getCartFromStore = async ({ origin, storeId, cartId, forceUpdate = false }) => {
	let existingCart

	cartStore.subscribe((value) => {
		if (value?.items?.length && Object.values(value)?.length) {
			existingCart = value
		}
	})

	if ((!loadingForCart && !existingCart) || !!forceUpdate) {
		loadingForCart = true
		cartLoadingStore.update((u) => true)
		const cartDataFromServer = await CartService.fetchRefreshCart({ cartId, storeId, origin })

		cartStore.update((u) => cartDataFromServer)

		loadingForCart = false
		cartLoadingStore.update((u) => false)
	}

	return existingCart
}

export const updateCartStore = async ({ data }) => {
	cartStore.update((u) => data)
	return true
}
