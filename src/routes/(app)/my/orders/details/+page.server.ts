import { getAPI } from '$lib/util/api'
import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ params, url, locals, parent, request }) {
	const { store } = locals
	const { id } = params

	const order = await gett(`orders/${id}?store=${store?.id}`, request.headers.get('cookie'))
	const orderTracking = await gett(`order-tracking?order=${id}&store=${store?.id}`)

	// console.log('order = ', order)

	if (order) {
		return { order, orderTracking }
	} else {
		throw error(404, 'Order not found')

		// return {
		// 	status: 404,
		// 	errors: 'Order not found'
		// }
	}
}
