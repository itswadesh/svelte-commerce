import { OrdersService } from '$lib/services'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ params, url, locals, cookies, request }) {
	const storeId = locals?.store?.id
	const { id } = params
	const sid = cookies.get('connect.sid')
	const order = await OrdersService.fetchOrder({
		id,
		storeId,
		server: true,
		sid
	})
	const orderTracking = await OrdersService.fetchTrackOrder({
		id,
		storeId,
		server: true,
		sid
	})
	if (order) {
		return { order, orderTracking }
	} else {
		throw error(404, 'Order not found')
	}
}
