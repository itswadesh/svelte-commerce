import { OrdersService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ locals }) {
	try {
		const storeId = locals.store?.id
		const sid = locals.sid
		const res = await OrdersService.fetchOrders({
			storeId,
			sid
		})

		if (res) {
			return res
		}
	} catch (e) {
		throw error(400, e?.message)
	}
	throw error(404, 'Orders not found')
}
