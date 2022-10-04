import { getAPI } from '$lib/util/api'
import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ params, url, locals, parent, request }) {
	const { store } = locals
	const { slug } = params
	const orderId = url.searchParams.get('orderId')
	const itemId = url.searchParams.get('itemId')
	const order = await gett(
		`orders/order-items/${orderId}?store=${store?.id}`,
		request.headers.get('cookie')
	)

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
