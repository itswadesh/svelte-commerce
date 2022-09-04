import { getAPI } from '$lib/util/api'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ params, url, parent, request }) {
	const { store } = await parent()
	const { slug } = params
	let orderId = url.searchParams.get('orderId')
	let itemId = url.searchParams.get('itemId')
	const order = await getAPI(`orders/order-items/${orderId}?store=${store?.id}`, request.headers)

	// console.log('order = ', order)

	if (order) {
		return { order }
	} else {
		throw error(404, 'Order not found')
		// return {
		// 	status: 404,
		// 	errors: 'Order not found'
		// }
	}
}
