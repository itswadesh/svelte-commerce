import { error, redirect } from '@sveltejs/kit'
import { services } from '@misiki/litekart-utils'

export async function load({ cookies, locals }) {
	try {
		const res = await services.OrdersService.fetchOrders({
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