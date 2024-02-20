import { services } from '@misiki/litekart-utils'
import { writable } from 'svelte/store'

export const categoriesStore = writable([])

let isLoading = false

export const getCategoriesFromStore = async ({ origin, storeId, forceUpdate = false }) => {
	let existingCategories = []

	categoriesStore.subscribe((value) => {
		if (value && value.length) {
			existingCategories = value
		}
	})

	if ((!isLoading && !existingCategories) || !!forceUpdate) {
		isLoading = true

		const categoriesDataFromServer = await services.CategoryService.fetchAllCategories({
			storeId,
			origin
		})

		categoriesStore.update((u) => categoriesDataFromServer?.data || [])

		isLoading = false
	}

	return existingCategories
}
