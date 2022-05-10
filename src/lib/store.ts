import { get } from './util/api'
import { writable } from 'svelte/store'

import Cookie from 'cookie-universal'
import { KQL_Megamenu, KQL_Settings, KQL_StoreOne } from './graphql/_kitql/graphqlStores'
const cookies = Cookie()

export const settings = writable({})
export const store = writable({})
export const megamenu = writable({})
export const loginUrl = writable('/auth/login')
export const me = writable({})
export const loadingDelayed = writable(false)

export const fetchSettings = async () => {
	try {
		const data = (await KQL_Settings.query({ fetch })).data?.settings
		settings.set(data)
		if (data.otpLogin) loginUrl.set('/auth/otp-login')
	} catch (e) {
		settings.set({})
	}
}
export const fetchStore = async () => {
	try {
		const storeOne = await cookies.get('store')
		const data = { _id: storeOne.id } //await get('es/store?domain=atozzones.com')
		store.set(data)
		KQL_StoreOne.query({ fetch, variables: { id: storeOne.id } })
		const data1 = (await KQL_Megamenu.query({ fetch, variables: { store: storeOne.id } })).data
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
