import { services } from '@misiki/litekart-utils'
import { writable } from 'svelte/store'

export const menuStore = writable([])

let loadingForMenu = false

export const getMenuFromStore = async ({ origin, storeId, forceUpdate = false }) => {
	let existingMenu

	menuStore.subscribe((value) => {
		if (value && Object.values(value)?.length) {
			existingMenu = value
		}
	})

	if ((!loadingForMenu && !existingMenu) || !!forceUpdate) {
		loadingForMenu = true

		const menuDataFromServer = await services.MenuService.fetchMenuData({
			storeId,
			origin
		})

		menuStore.update((u) => menuDataFromServer)

		loadingForMenu = false
	}

	return existingMenu
}
