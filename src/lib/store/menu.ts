import { MenuService } from '$lib/services'
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
		try {
			const menuDataFromServer = await MenuService.fetchMenuData({
				storeId,
				origin
			})

			menuStore.update((u) => menuDataFromServer)
		} catch (e) {
			console.log('store/menu error', e)
		} finally {
			loadingForMenu = false
		}
	}

	return existingMenu
}
