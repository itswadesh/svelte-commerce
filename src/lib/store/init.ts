import { writable } from 'svelte/store'
import { InitService } from '$lib/services'
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
	// console.log('existingInit', !existingInit?.store && isServer && !isLoading)
	if (!existingInit?.storeOne?._id && isServer && !isLoading) {
		isLoading = true
		initDataFromServer = await InitService.fetchInit(host)
		initStore.update((u) => initDataFromServer)
		isLoading = false
	}
	return existingInit
}
