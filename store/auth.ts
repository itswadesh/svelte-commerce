import { writable } from 'svelte/store'
import { get, post, put } from '../src/util/api'
const { subscribe, set } = writable({})
export const me = async (token?) => {
	try {
		let user = (await get('users/me', null, token)) || {}
		set(user)
		return user
	} catch (e) {
		set({})
		return {}
	}
}
export const login = async ({ phone, password }) => {
	try {
		let data = await post('auth/local', { phone, password })
		set(data)
		return data
	} catch (e) {
		set({})
		throw e
	}
}
export const signup = async (credentials) => {
	try {
		const data = await post('users', credentials)
		set(data)
		return data
	} catch (e) {
		set({})
		throw e
	}
}
export const logout = async () => {
	try {
		set({})
		return response
	} catch (e) {
		set({})
		throw e
	}
}
export const forgotPassword = async (payload) => {
	try {
		return await post('/users/forgot', payload)
	} catch (e) {
		throw e
	}
}
export const changePassword = async (payload) => {
	try {
		const data = await put('/users/password', payload)
		return data
	} catch (e) {
		throw e
	}
}
export const resetPassword = async (payload) => {
	try {
		const data = await post('/users/reset/' + payload.id, payload)
		if (data) {
			// console.log('info', data, { root=true })
			// router.push('/')
		}
		return data
	} catch (e) {
		throw e
	}
}
export const updateProfile = async ({
	firstName,
	lastName,
	state,
	city,
	zip,
	avatar,
	gender,
	dob,
	language,
	address,
}) => {
	try {
		const data = await put('/users/profile', {
			firstName,
			lastName,
			state,
			city,
			zip,
			avatar,
			gender,
			dob,
			language,
			address,
		})
		set(data)
		return data
	} catch (e) {
		throw e
	}
}
