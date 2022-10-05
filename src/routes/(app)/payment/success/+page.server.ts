import { post } from '$lib/utils'
import { error, redirect } from '@sveltejs/kit'
export const prerender = false

export async function load({ url, request, cookies }) {
	const orderId = url.searchParams.get('id')
	const status = url.searchParams.get('status')
	const paymentMode = url.searchParams.get('provider')
	let loading, err, order
	try {
		loading = true
		// request.headers.set('content-type', 'application/json')

		const res = await post(
			`orders/pay-sucess-page-hit`,
			{
				paymentMode: paymentMode,
				status: status,
				orderId: orderId
			},
			cookies
		)

		order = res
	} catch (e) {
		if (e.status === 401) {
			throw redirect(307, '/auth/otp-login')
		}
		err = e
		throw error(400, e?.message || e)
		// return {
		// 	status: 400,
		// 	errors: new Error(e?.message || e)
		// }
	} finally {
		loading = false
	}
	return { loading, status, paymentMode, order, err }
}
