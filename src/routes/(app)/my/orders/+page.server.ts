import { error, redirect } from '@sveltejs/kit'
import { OrdersService } from '$lib/services'

export async function load({ cookies, locals }) {
	try {
		const res = await OrdersService.fetchOrders({
			origin: locals.origin,
			sid: cookies.get('connect.sid'),
			storeId: locals.storeId
		})

		if (res) {
			return res
		}
	} catch (e) {
		redirect(307, '/auth/login')
	}

	error(404, 'Orders not found')
}
