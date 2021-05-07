import { writable } from 'svelte/store'
import { get, post } from './../src/util/api'
export const store = writable({})
export const settings = async ({ email, password }) => {
	try {
		let data = await get('settings')
		store.set(data)
		return data
	} catch (e) {
		store.set({})
		throw e.toString()
	}
}
