import cookie from 'cookie'
import { v4 as uuid } from '@lukeed/uuid'
import type { Handle } from '@sveltejs/kit'
import { get } from '../util/api'
import { addToCart, fetchCart, cart } from './../../store/cart'
import { me } from './../../store/auth'
import { authorInfo } from './../../config'
export const handle: Handle = async ({ request, resolve }) => {
	const cookies = cookie.parse(request.headers.cookie || '')
	const token = cookies.token
	request.locals.token = `${token}`
	if (request.query.has('_method')) {
		request.method = request.query.get('_method').toUpperCase()
	}
	// me(token)
	try {
		const settings = (await get('settings')).data || {}
		request.locals.settings = settings
	} catch (e) {
		request.locals.settings = {}
	}
	try {
		let categories = (await get('categories/megamenu')).data || []
		request.locals.categories = categories
	} catch (err) {
		request.locals.categories = {}
	}
	try {
		const user = (await get('users/me', null, token)) || { guest: true }
		request.locals.user = user
	} catch (e) {
		request.locals.user = null
	}
	console.log('kkkkkkkkkkkkkkkkkkkkkkkkkk', token)
	fetchCart(token) // Me will not throw error

	const response = await resolve(request)

	// if (!cookies.cookie) {
	// 	// if this is the first time the user has visited this app,
	// 	// set a cookie so that we recognise them when they return
	// 	response.headers['set-cookie'] = `cookie=${request.locals.cookie}; Path=/; HttpOnly`
	// }

	response.headers['Authorization'] = `${token}; Path=/; HttpOnly`
	return response
}

export const getSession = ({ locals }) => {
	const { user, token, categories, settings } = locals
	return {
		user,
		token,
		categories,
		settings,
		DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE,
	}
}

// export const serverFetch = async (request) => {
// 	if (request.url.startsWith('https://api.yourapp.com/')) {
// 		// clone the original request, but change the URL
// 		request = new Request(
// 			request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),
// 			request
// 		)
// 	}

// 	return fetch(request)
// }
