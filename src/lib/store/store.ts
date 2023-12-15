import { InitService } from '$lib/services'
import { writable } from 'svelte/store'

export const storeStore = writable({})
export const menuStore = writable([])
export const megamenuStore = writable([])
export const popularSearchesStore = writable([])
export const storeLoadingStore = writable(false)

let loadingForStore = false

export const getStoreFromStore = async ({ origin, host, storeId, forceUpdate = false }) => {
	let existingStore
	let existingMenu
	let existingMegamenu
	let existingpopularSearches

	storeStore.subscribe((value) => {
		if (value && Object.values(value)?.length) {
			existingStore = value
		}
	})

	menuStore.subscribe((value) => {
		if (value && Object.values(value)?.length) {
			existingMenu = value
		}
	})

	megamenuStore.subscribe((value) => {
		if (value && Object.values(value)?.length) {
			existingMegamenu = value
		}
	})

	popularSearchesStore.subscribe((value) => {
		if (value && Object.values(value)?.length) {
			existingpopularSearches = value
		}
	})
	// console.log('true || true', !loadingForStore && !existingStore, !!forceUpdate)
	if ((!loadingForStore && !existingStore) || !!forceUpdate) {
		loadingForStore = true
		storeLoadingStore.update((u) => true)
		const storeDataFromServer = await InitService.fetchInit({ host, origin })
		storeStore.update((u) => storeDataFromServer.storeOne)
		menuStore.update((u) => storeDataFromServer.menu)
		megamenuStore.update((u) => storeDataFromServer.megamenu)
		popularSearchesStore.update((u) => storeDataFromServer.popularSearches)

		loadingForStore = false
		storeLoadingStore.update((u) => false)
	}
	return { existingStore, existingMenu, existingMegamenu, existingpopularSearches }
}
