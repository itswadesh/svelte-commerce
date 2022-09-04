import { getAPI } from '$lib/util/api'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, request }) {
	const { store } = await parent()
	try {
		const orders = await getAPI(`orders/order-items/my?store=${store?.id}`, request.headers)

		// console.log('orders = ', orders)

		if (orders) {
			return { orders: orders }
		}
	} catch (e) {
		throw error(400, e?.message)
	}
	throw error(404, 'Orders not found')
}
