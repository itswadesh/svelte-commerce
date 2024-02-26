import { CategoryService } from '$lib/services'
import { writable } from 'svelte/store'

export const megamenuStore = writable([])
export const megamenuAllStore = writable([])

let loadingForMegamenu = false
let loadingForAllMegamenu = false

export const getMegamenuFromStore = async ({ origin, storeId, forceUpdate = false }) => {
	let existingMegamenu

	megamenuStore.subscribe((value) => {
		if (value && Object.values(value)?.length) {
			existingMegamenu = value
		}
	})

	if ((!loadingForMegamenu && !existingMegamenu) || !!forceUpdate) {
		loadingForMegamenu = true
		try {
			const megamenuDataFromServer = await CategoryService.fetchMegamenuData({
				megamenu: true,
				storeId,
				origin
			})

			megamenuStore.update((u) => megamenuDataFromServer)
		} catch (e) {
			console.log('store/megamneu error', e)
		} finally {
			loadingForMegamenu = false
		}
	}

	return existingMegamenu
}

export const getAllMegamenuFromStore = async ({ origin, storeId, forceUpdate = false }) => {
	let existingAllMegamenu

	megamenuAllStore.subscribe((value) => {
		if (value && Object.values(value)?.length) {
			existingAllMegamenu = value
		}
	})

	if ((!loadingForAllMegamenu && !existingAllMegamenu) || !!forceUpdate) {
		loadingForAllMegamenu = true
		try {
			const megamenuAllDataFromServer = await CategoryService.fetchMegamenuData({
				megamenu: false,
				storeId,
				origin
			})
			megamenuAllStore.update((u) => megamenuAllDataFromServer)
		} catch (e) {
			console.log('store/megamneu error', e)
		} finally {
			loadingForAllMegamenu = false
		}
	}

	// console.log('existingAllMegamenu', existingAllMegamenu);

	return existingAllMegamenu
}
