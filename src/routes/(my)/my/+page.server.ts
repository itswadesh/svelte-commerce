// import { OrderService, VendorService } from '$lib/services'
// import { error, redirect } from '@sveltejs/kit'

// export const load = async ({ fetch }) => {
// 	try {
// 		const [vendor, summary, orders] = await Promise.all([VendorService.list({}), VendorService.fetchDashboard(), OrderService.list({})])
// 		return {
// 			vendor,
// 			summary,
// 			orders
// 		}
// 	} catch (e) {
// 		redirect(307, '/?show_auth=true&login=true')
// 	}
// }
