import { writable, readable, derived } from 'svelte/store'
function toaster() {
  const { subscribe, set } = writable({
    show: false,
    msg: null,
    duration: 3000,
    color: 'info',
  })
  return {
    subscribe,
    show: (data) => {
      data.color = data.color || 'info'
      let duration = data.duration || 3000
      set(data)
      setTimeout(() => {
        set({})
      }, duration)
      return data
    },
    hide: () => {
      set({})
      return {}
    },
  }
}
export const toast = toaster()
