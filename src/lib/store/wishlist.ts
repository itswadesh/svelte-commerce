import { WishlistService } from '$lib/services'
import { writable } from 'svelte/store'

export const wishlistStore = writable([])

let loadingForWishlist = false

export const getWishlistFromStore = async ({
	origin,
	storeId,
	sid = null,
	forceUpdate = false
}) => {
	let existingWishlist = []
	wishlistStore.subscribe((value) => {
		if (value && Object.values(value)?.length) {
			existingWishlist = value
		}
	})

	if ((!loadingForWishlist && Object.values(existingWishlist)?.length < 1) || !!forceUpdate) {
		loadingForWishlist = true

		const dataFromServer = await WishlistService.fetchWishlist({
			sid,
			storeId,
			origin
		})
		wishlistStore.update((u) => dataFromServer.data)

		loadingForWishlist = false
	}

	// console.log('existingWishlist', existingWishlist);

	return existingWishlist
}

export const updateWishlistStore = async (data) => {
	wishlistStore.update((u) => data)
	return true
}
