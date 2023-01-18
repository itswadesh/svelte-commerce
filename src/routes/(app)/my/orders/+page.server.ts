import { fetchOrders } from '$lib/services/OrdersService'
import { gett } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, request, locals, cookies }) {
	try {
		const orders = await fetchOrders({storeId:locals.store?.id, server:true,sid:cookies.get('sid')})
		if (orders) {
			return { orders: orders }
		}
	} catch (e) {
		throw error(400, e?.message)
	}
	throw error(404, 'Orders not found')
}
