import { writable } from 'svelte/store'
import { CategoryService } from '$lib/services'
export const megamenuStore = writable([])
const isServer = import.meta.env.SSR
let isLoading = false

export const getMegamenuFromStore = async ({ sid, origin, storeId, isCors }) => {
	let existingMegamenu
	megamenuStore.subscribe((value) => {
		if (value.length) {
			existingMegamenu = value
		}
	})
	if (!isLoading && !existingMegamenu) {
		isLoading = true
		const megamenuDataFromServer = await CategoryService.fetchMegamenuData({
			megamenu: true,
			storeId,
			origin
		})
		megamenuStore.update((u) => megamenuDataFromServer)
		isLoading = false
	}
	return existingMegamenu
}
