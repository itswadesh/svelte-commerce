import { PageService } from '$lib/services'
import { writable } from 'svelte/store'

export const pagesStore = writable([])

let isLoading = false

export const getPagesFromStore = async ({ origin, storeId, forceUpdate = false }) => {
	let existingPages = null

	pagesStore.subscribe((value) => {
		if (value && Object.values(value)?.length) {
			existingPages = value
		}
	})

	if ((!isLoading && !existingPages) || !!forceUpdate) {
		isLoading = true
		try {
			const pagesDataFromServer = await PageService.fetchPages({
				storeId,
				origin
			})

			pagesStore.update((u) => pagesDataFromServer || [])
		} catch (e) {
			console.log('error', e)
		} finally {
			isLoading = false
		}
	}

	return existingPages
}
