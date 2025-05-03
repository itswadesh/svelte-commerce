import { OrdersService } from '$lib/core/services'
import { redirect } from '@sveltejs/kit'

export async function load({ fetch }) {
	// try {
	//     const res = await OrdersService.list(fetch)
	//     return res
	// } catch (e) {
	//     redirect(307, '/?show_auth=true&login=true')
	// }
}

