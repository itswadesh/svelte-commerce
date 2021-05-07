import cookie from 'cookie'
import { v4 as uuid } from '@lukeed/uuid'
import type { Handle } from '@sveltejs/kit'
import { get } from '../util/api'
import { addToCart, fetchCart, cart } from './../../store/cart'
import { me } from './../../store/auth'

export const handle: Handle = async ({ request, render }) => {
	// console.log('Handle Called...............')
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
		console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', categories)
		request.locals.categories = categories
	} catch (err) {
		request.locals.categories = {}
	}
	try {
		const user = (await get('users/me', null, token)) || { guest: true }
		request.locals.user = user
	} catch (e) {
		request.locals.user = {}
	}
	fetchCart(token) // Me will not throw error

	const response = await render(request)

	// if (!cookies.cookie) {
	// 	// if this is the first time the user has visited this app,
	// 	// set a cookie so that we recognise them when they return
	// 	response.headers['set-cookie'] = `cookie=${request.locals.cookie}; Path=/; HttpOnly`
	// }

	response.headers['Authorization'] = `${token}; Path=/; HttpOnly`
	return response
}

export function getSession({ locals }) {
	const { user, token, categories, settings } = locals
	return {
		user,
		token,
		categories,
		settings,
		DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE,
	}
}
