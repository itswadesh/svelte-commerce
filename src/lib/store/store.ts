import { InitService } from '$lib/services'
import { writable } from 'svelte/store'

export const storeStore = writable({})
export const storeLoadingStore = writable(false)

let loadingForStore = false

export const getStoreFromStore = async ({ origin, host, storeId, forceUpdate = false }) => {
	let existingStore

	storeStore.subscribe((value) => {
		if (value?.items?.length && Object.values(value)?.length) {
			existingStore = value
		}
	})

	if ((!loadingForStore && !existingStore) || !!forceUpdate) {
		loadingForStore = true
		storeLoadingStore.update((u) => true)
		const storeDataFromServer = await InitService.fetchInit({ host, origin })
		storeStore.update((u) => storeDataFromServer)

		loadingForStore = false
		storeLoadingStore.update((u) => false)
	}

	return existingStore
}
