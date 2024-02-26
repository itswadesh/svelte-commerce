import { CategoryService } from '$lib/services'
import { writable } from 'svelte/store'

export const autocompleteStore = writable({})

let isLoading = false

export const findAutocompleteFromStore = async ({ sid, storeId, origin, forceUpdate = false }) => {
	let existingAutocomplete = []

	autocompleteStore.subscribe((value) => {
		if (value && value?.length) {
			existingAutocomplete = value
		}
	})

	if ((!isLoading && !existingAutocomplete) || !!forceUpdate) {
		isLoading = true
		try {
			const autocompleteDataFromServer = await CategoryService.fetchAllCategories({
				sid,
				origin,
				storeId,
				featured: false
			})

			autocompleteStore.update((u) => autocompleteDataFromServer?.data)
		} catch (e) {
			console.log('error', e)
		} finally {
			isLoading = false
		}
	}

	return existingAutocomplete
}
