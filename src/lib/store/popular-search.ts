import { CategoryService } from '$lib/services'
import { writable } from 'svelte/store'

export const popularsearchStore = writable({})

let isLoading = false

export const getPopularSearchFromStore = async ({
	sid = null,
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
		try {
			const popularsearchDataFromServer = await CategoryService.fetchAllCategories({
				sid,
				origin,
				storeId
			})

			// existingPopularSearch = popularsearchDataFromServer.data
			popularsearchStore.update((u) => popularsearchDataFromServer.data)
		} catch (e) {
			console.log('error', e)
		} finally {
			// const popularsearchDataFromServer = await PopularSearchService.fetchPopularSearch({
			// 	sid,
			// 	origin,
			// 	storeId,
			// })

			// popularsearchStore.update((u) => popularsearchDataFromServer)

			isLoading = false
		}
	}

	return existingPopularSearch
}
