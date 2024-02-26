import { CategoryService } from '$lib/services'
import { writable } from 'svelte/store'

export const categoriesStore = writable([])

let isLoading = false

export const getCategoriesFromStore = async ({
	origin,
	storeId,
	featured = false,
	forceUpdate = false
}) => {
	let existingCategories = []

	categoriesStore.subscribe((value) => {
		if (value && value.length) {
			existingCategories = value
		}
	})

	if ((!isLoading && !existingCategories) || !!forceUpdate) {
		isLoading = true
		try {
			const cQ: any = {
				storeId,
				origin
			}
			if (featured) {
				cQ.featured = featured
			}
			const categoriesDataFromServer = await CategoryService.fetchAllCategories(cQ)

			categoriesStore.update((u) => categoriesDataFromServer?.data || [])
		} catch (e) {
			console.log('error', e)
		} finally {
			isLoading = false
		}
	}

	return existingCategories
}
