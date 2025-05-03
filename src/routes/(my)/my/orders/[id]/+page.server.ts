// import { error, redirect } from '@sveltejs/kit'
// import { orderService } from '$lib/services'

// export const prerender = false

// export async function load({ params, fetch }) {
// 	try {
// 		const { id } = params

//    const orderService = new OrderService(fetch)
// 		const order = await orderService.get(id)

// 		const orderTracking = await OrderService.fetchTrackOrder(id)

// 		if (order) {
// 			return { order, orderTracking }
// 		}
// 	} catch (e) {
// 		console.log(e)
// 		redirect(307, '/?show_auth=true&login=true')
// 	}
// }
