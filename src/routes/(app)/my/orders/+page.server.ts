import { OrdersService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ locals, cookies }) {
	try {
		const storeId = locals.store?.id

		const res = await OrdersService.fetchOrders({
			storeId,
			server: true,
			origin: locals.origin,
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
