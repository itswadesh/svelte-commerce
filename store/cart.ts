import { writable } from 'svelte/store'
import { get, post } from '../src/util/api'
export const cart = writable({
	email: null,
	items: [],
	qty: 0,
	subtotal: 0,
	total: 0,
	uid: null,
	discount: 0,
})
export const setCart = async (data) => {
	try {
		cart.set(data)
	} catch (e) {}
}
export const fetchCart = async (token?) => {
	try {
		const data = (await get('cart', null, token)) || { qty: 0, items: [] }
		cart.set(data)
		return data
	} catch (e) {
		return {}
	}
}
export const addToCart = async (payload) => {
	try {
		const data = await post('cart/add', payload)
		cart.set(data)
		return data
	} catch (e) {
		throw e.toString()
	}
}
export const checkout = async ({ paymentMethod, address }) => {
	try {
		let order = await post('orders', {
			address,
			paymentMethod: paymentMethod || 'COD',
		})
		const data = await fetchCart()
		cart.set(data)
		return order
	} catch (e) {
		throw e
	}
}
