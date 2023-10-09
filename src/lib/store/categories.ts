import { writable } from 'svelte/store'
import { CategoryService } from '$lib/services'
export const categoriesStore = writable([])
let isLoading = false

export const getCategoriesFromStore = async ({ origin, storeId, isCors }) => {
	let existingCategories = []
	categoriesStore.subscribe((value) => {
		if (value.length) {
			existingCategories = value
		}
	})
	if (!isLoading && !existingCategories) {
		isLoading = true
		const categoriesDataFromServer = await CategoryService.fetchAllCategories({
			storeId,
			origin,
			isCors
		})
		categoriesStore.update((u) => categoriesDataFromServer?.data || [])
		isLoading = false
	}
	return existingCategories
}
