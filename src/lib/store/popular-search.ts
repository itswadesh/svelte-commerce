import { services } from '@misiki/litekart-utils'
import { writable } from 'svelte/store'

export const popularsearchStore = writable({})

let isLoading = false

export const getPopularSearchFromStore = async ({
	limit,
	sid,
	storeId,
	origin,
	forceUpdate = false
}) => {
	let existingPopularSearch = null

	popularsearchStore.subscribe((value) => {
		if (value && Object.values(value)?.length) {
			existingPopularSearch = value
		}
	})

	if ((!isLoading && !existingPopularSearch) || !!forceUpdate) {
		isLoading = true

		const popularsearchDataFromServer = await services.CategoryService.fetchAllCategories({
			sid,
			origin,
			storeId
		})

		// console.log('popularsearchDataFromServer', popularsearchDataFromServer);

		// existingPopularSearch = popularsearchDataFromServer.data
		popularsearchStore.update((u) => popularsearchDataFromServer.data)

		// const popularsearchDataFromServer = await services.PopularSearchService.fetchPopularSearch({
		// 	sid,
		// 	origin,
		// 	storeId,
		// })

		// popularsearchStore.update((u) => popularsearchDataFromServer)

		isLoading = false
	}

	return existingPopularSearch
}
