import { InitService } from '$lib/services'
import { writable } from 'svelte/store'

export const initStore = writable({})

const isServer = import.meta.env.SSR
let isLoading = false

export const fetchInitFromStore = async (host) => {
	let existingInit

	initStore.subscribe((value) => {
		if (value) {
			existingInit = value
			return existingInit
		}
	})

	let initDataFromServer

	if (!existingInit?.storeOne?._id && isServer && !isLoading) {
		isLoading = true
		try {
			initDataFromServer = await InitService.fetchInit({ host })
			initStore.update((u) => initDataFromServer)
		} catch (e) {
			console.log('error', e)
		} finally {
			isLoading = false
		}
	}

	// console.log('existingInit', existingInit);

	return existingInit
}
