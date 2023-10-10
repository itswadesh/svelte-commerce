import { writable } from 'svelte/store'
import { CategoryService } from '$lib/services'
export const autocompleteStore = writable({})
let isLoading = false
let existingAutocomplete = []
export const findAutocompleteFromStore = async ({ isCors, sid, storeId, origin }) => {
	let existingAutocomplete = []
	autocompleteStore.subscribe((value) => {
		if (value.length) {
			existingAutocomplete = value
		}
	})
	if (!isLoading && !existingAutocomplete) {
		isLoading = true
		const autocompleteDataFromServer = await CategoryService.fetchAllCategories({
			sid,
			origin,
			storeId,
			isCors,
			featured: false
		})
		autocompleteStore.update((u) => autocompleteDataFromServer?.data)
		isLoading = false
	}
	return existingAutocomplete
}
