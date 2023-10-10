import { writable } from 'svelte/store'
import { CategoryService } from '$lib/services'

export const menuStore = writable([])

let loadingForMegamenu = false

export const getMenuFromStore = async ({ origin, storeId, isCors }) => {
	let existingMegamenu
	menuStore.subscribe((value) => {
		if (value.length) {
			existingMegamenu = value
		}
	})
	if (!loadingForMegamenu && !existingMegamenu) {
		loadingForMegamenu = true
		const megamenuDataFromServer = await CategoryService.fetchMegamenuData({
			megamenu: true,
			storeId,
			origin,
			isCors
		})
		menuStore.update((u) => megamenuDataFromServer)
		loadingForMegamenu = false
	}
	return existingMegamenu
}
