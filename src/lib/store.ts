import { get } from './util/api'
import { writable } from 'svelte/store'

import Cookie from 'cookie-universal'
import { GQL_megamenu, GQL_settings, GQL_storeOne } from '$houdini'
const cookies = Cookie()

export const settings = writable({})
export const store = writable({})
export const megamenu = writable({})
export const loginUrl = writable('/auth/login')
export const me = writable({})
export const loadingDelayed = writable(false)

export const fetchSettings = async () => {
	try {
		const data = (await GQL_settings.fetch({ fetch })).data?.settings
		settings.set(data)
		if (data.otpLogin) loginUrl.set('/auth/login')
	} catch (e) {
		settings.set({})
	}
}
export const fetchStore = async () => {
	try {
		const storeOne = await cookies.get('store')
		const data = { _id: storeOne.id } //await get('es/store?domain=atozzones.com')
		store.set(data)
		GQL_storeOne.fetch({ fetch, variables: { id: storeOne.id } })
		const data1 = (await GQL_megamenu.fetch({ fetch, variables: { store: storeOne.id } })).data
			?.megamenu //get('es/categories/megamenu', { megamenu: true })
		megamenu.set(data1)
	} catch (e) {
		store.set({})
	}
}
export const fetchUser = async () => {
	try {
		const data = await get('es/users/me')
		me.set(data)
	} catch (e) {
		me.set({})
	}
}
// fetchSettings()
// fetchStore()
// fetchUser()
