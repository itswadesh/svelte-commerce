import { error, redirect } from '@sveltejs/kit'
import { services } from '@misiki/litekart-utils'

export const prerender = false

export async function load({ params, locals, cookies }) {
	try {
		const { id } = params
		const { storeId } = locals
		const sid = cookies.get('connect.sid')

		const order = await services.OrdersService.fetchOrder({
			id,
			origin: locals.origin,
			sid: cookies.get('connect.sid'),
			storeId: locals.storeId
		})

		const orderTracking = await services.OrdersService.fetchTrackOrder({
			id, origin: locals.origin,
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
