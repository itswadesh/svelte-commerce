import { services } from '@misiki/litekart-utils'
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

		const autocompleteDataFromServer = await services.CategoryService.fetchAllCategories({
			sid,
			origin,
			storeId,
			featured: false
		})

		autocompleteStore.update((u) => autocompleteDataFromServer?.data)

		isLoading = false
	}

	return existingAutocomplete
}
