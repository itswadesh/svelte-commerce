import { fetchOrder, fetchTrackOrder } from '$lib/services/OrdersService'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ params, url, locals, cookies, request }) {
	const { store } = locals
	const { id } = params
	const order = await fetchOrder({
		storeId: locals.store?.id,
		id,
		server: true,
		sid: cookies.get('sid')
	})
	const orderTracking = await fetchTrackOrder({ id, store: store?.id, server: true })
	if (order) {
		return { order, orderTracking }
	} else {
		throw error(404, 'Order not found')
	}
}
