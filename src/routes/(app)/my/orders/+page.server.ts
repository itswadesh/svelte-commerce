import { OrdersService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, request, locals, cookies }) {
	try {
		const res = await OrdersService.fetchOrders({
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('connect.sid')
		})
		if (res) {
			return res
		}
	} catch (e) {
		throw error(400, e?.message)
	}
	throw error(404, 'Orders not found')
}
