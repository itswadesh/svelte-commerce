import { OrdersService } from '$lib/services'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ params, url, locals, cookies, request }) {
	const { store } = locals
	const { id } = params
	const order = await OrdersService.fetchOrder({
		storeId: locals.store?.id,
		id,
		server: true,
		sid: cookies.get('connect.sid')
	})
	const orderTracking = await OrdersService.fetchTrackOrder({ id, storeId: store?.id, server: true })
	if (order) {
		return { order, orderTracking }
	} else {
		throw error(404, 'Order not found')
	}
}
