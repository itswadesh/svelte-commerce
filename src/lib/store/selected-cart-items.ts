import { writable } from 'svelte/store'

export const selectedCartItemsStore = writable([])

let loadingForSelectedCartItems = false

export const getSelectedCartItemsFromStore = async ({ origin, host, storeId, forceUpdate = false }) => {
  let existingSelectedCartItems

  selectedCartItemsStore.subscribe((value) => {
    if (value && Object.values(value)?.length) {
      existingSelectedCartItems = value
    }
  })

  if ((!loadingForSelectedCartItems && !existingSelectedCartItems) || !!forceUpdate) {
    loadingForSelectedCartItems = true
    selectedCartItemsStore.update((u) => [])
    loadingForSelectedCartItems = false
  }
}

export const updateSelectedCartItemsStore = async ({ data }) => {
  selectedCartItemsStore.update((u) => data)
  return true
}