import { writable } from 'svelte/store'
import { get, post } from './../lib/api'
function authenticate() {
  const { subscribe, set } = writable({})
  return {
    subscribe,
    settings: async ({ email, password }) => {
      try {
        let data = await get('settings')
        set(data)
        // cookies.set('Authorization', data.token, { path: '/', maxAge: tokenExpiry })
        return data
      } catch (e) {
        set({})
        throw e.toString()
      }
    },
  }
}
export const auth = authenticate()
