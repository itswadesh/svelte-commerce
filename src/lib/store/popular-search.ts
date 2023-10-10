import { writable } from 'svelte/store'
import { CategoryService, PopularSearchService } from '$lib/services'
export const popularsearchStore = writable({})
let isLoading = false

export const getPopularSearchFromStore = async ({ limit, isCors, sid, storeId, origin }) => {
	let existingPopularSearch = null

	popularsearchStore.subscribe((value) => {
		if (value?.length) {
			existingPopularSearch = value
		}
	})

	if (!isLoading && !existingPopularSearch) {
		isLoading = true

		const popularsearchDataFromServer = await CategoryService.fetchAllCategories({
			sid,
			origin,
			storeId,
			isCors
		})

		// console.log('popularsearchDataFromServer', popularsearchDataFromServer);
		// existingPopularSearch = popularsearchDataFromServer.data
		popularsearchStore.update((u) => popularsearchDataFromServer.data)

		// const popularsearchDataFromServer = await PopularSearchService.fetchPopularSearch({
		// 	sid,
		// 	origin,
		// 	storeId,
		// 	isCors
		// })

		// popularsearchStore.update((u) => popularsearchDataFromServer)
		isLoading = false
	}

	return existingPopularSearch
}
