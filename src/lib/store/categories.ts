import { CategoryService } from '$lib/services'
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
		try {
			const categoriesDataFromServer = await CategoryService.fetchAllCategories({
				storeId,
				origin
			})

			categoriesStore.update((u) => categoriesDataFromServer?.data || [])
		} catch (e) {
			console.log('error', e)
		} finally {
			isLoading = false
		}
	}

	return existingCategories
}
