import { OrdersService } from '$lib/services'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ params, locals, cookies }) {
	const { id } = params
	const sid = cookies.get('connect.sid')
	const storeId = locals?.store?.id

	const order = await OrdersService.fetchOrder({
		id,
		storeId,
		sid
	})
	const orderTracking = await OrdersService.fetchTrackOrder({ id, storeId, sid })

	if (order) {
		return { order, orderTracking }
	} else {
		throw error(404, 'Order not found')
	}
}
