import { OrdersService } from '$lib/services'
import { error, redirect } from '@sveltejs/kit'
export const prerender = false

export async function load({ params, locals, cookies }) {
	try {
		const { id } = params
		const sid = cookies.get('connect.sid')
		const storeId = locals?.store?.id

		const order = await OrdersService.fetchOrder({
			id,
			storeId,
			server: true,
			sid
		})

		const orderTracking = await OrdersService.fetchTrackOrder({ id, storeId, sid })

		if (order) {
			return { order, orderTracking }
		}
	} catch (e) {
		throw redirect(307, '/auth/login')
	}

	throw error(404, 'Order not found')
}
