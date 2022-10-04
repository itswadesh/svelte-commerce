import { getAPI } from '$lib/util/api'
import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, request, locals, cookies }) {
	const { store } = locals
	try {
		const orders = await gett(
			`orders/order-items/my?store=${store?.id}`,
			request.headers.get('cookie')
		)

		// console.log('orders = ', orders)

		if (orders) {
			return { orders: orders }
		}
	} catch (e) {
		throw error(400, e?.message)
	}
	throw error(404, 'Orders not found')
}
