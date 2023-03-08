import { writable } from 'svelte/store'
import { CategoryService } from '$lib/services'

export const megamenuStore = writable([])
export const megamenuAllStore = writable([])

let loadingForMegamenu = false
let loadingForAllMegamenu = false

export const getMegamenuFromStore = async ({ origin, storeId, isCors = false }) => {
	let existingMegamenu

	megamenuStore.subscribe((value) => {
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

		megamenuStore.update((u) => megamenuDataFromServer)

		loadingForMegamenu = false
	}
	return existingMegamenu
}

export const getAllMegamenuFromStore = async ({ origin, storeId, isCors = false }) => {
	let existingAllMegamenu

	megamenuAllStore.subscribe((value) => {
		if (value.length) {
			existingAllMegamenu = value
		}
	})

	if (!loadingForAllMegamenu && !existingAllMegamenu) {
		loadingForAllMegamenu = true

		const megamenuAllDataFromServer = await CategoryService.fetchMegamenuData({
			megamenu: false,
			storeId,
			origin,
			isCors
		})

		megamenuAllStore.update((u) => megamenuAllDataFromServer)
		loadingForAllMegamenu = false
	}

	// console.log('existingAllMegamenu', existingAllMegamenu);

	return existingAllMegamenu
}
