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
	set({})
	return 'success'
}
export const forgotPassword = async (payload) => {
	return await post('/users/forgot', payload)
}
export const changePassword = async (payload) => {
	const data = await put('/users/password', payload)
	return data
}
export const resetPassword = async (payload) => {
	const data = await post('/users/reset/' + payload.id, payload)
	if (data) {
		// router.push('/')
	}
	return data
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
	country,
}) => {
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
		country,
	})
	set(data)
	return data
}
