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

	// console.log('init from svelte store', !existingInit?.storeOne, isServer, !isLoading)
	// console.log('existingInit', existingInit)
	// console.log('!existingInit?.storeOne?._id && isServer && !isLoading', !existingInit?.storeOne?._id && isServer && !isLoading);

	if (!existingInit?.storeOne?._id && isServer && !isLoading) {
		isLoading = true
		initDataFromServer = await InitService.fetchInit(host)
		initStore.update((u) => initDataFromServer)
		isLoading = false
	}

	// console.log('existingInit', existingInit);

	return existingInit
}
