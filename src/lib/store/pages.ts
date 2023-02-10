import { writable } from 'svelte/store'
import { PageService } from '$lib/services'
export const pagesStore = writable([])
let isLoading = false

export const getPagesFromStore = async ({ origin, storeId, isCors }) => {
	let existingPages = null
	pagesStore.subscribe((value) => {
		if (value.length) {
			existingPages = value
		}
	})
	if (!isLoading && !existingPages) {
		isLoading = true
		const pagesDataFromServer = await PageService.fetchPages({
			storeId,
			origin,
			isCors
		})
		pagesStore.update((u) => pagesDataFromServer || [])
		isLoading = false
	}
	return existingPages
}
