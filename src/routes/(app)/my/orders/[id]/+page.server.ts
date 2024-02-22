import { error, redirect } from '@sveltejs/kit'
import { OrdersService } from '$lib/services'

export const prerender = false

export async function load({ params, locals, cookies }) {
	try {
		const { id } = params
		const { storeId } = locals
		const sid = cookies.get('connect.sid')

		const order = await OrdersService.fetchOrder({
			id,
			origin: locals.origin,
			sid: cookies.get('connect.sid'),
			storeId: locals.storeId
		})

		const orderTracking = await OrdersService.fetchTrackOrder({
			id,
			origin: locals.origin,
			sid: cookies.get('connect.sid'),
			storeId: locals.storeId
		})

		if (order) {
			return { order, orderTracking }
		}
	} catch (e) {
		redirect(307, '/auth/login')
	}

	error(404, 'Order not found')
}
