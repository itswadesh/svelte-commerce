import { fail, redirect } from '@sveltejs/kit'
import { OrdersService } from '$lib/services'

export const prerender = false

export async function load({ url, locals, cookies }) {
	const order_no = url.searchParams.get('order_no') || ''
	const orderId = url.searchParams.get('orderId') || url.searchParams.get('order_no')
	const paymentMode = url.searchParams.get('provider')
	const paymentReferenceId =
		url.searchParams.get('payment_reference_id') || url.searchParams.get('paymentId')
	const sid = cookies.get('connect.sid')
	const payment_status = url.searchParams.get('payment_status')
	const failed = url.searchParams.get('failed')
	const storeId = locals.storeId
	const pg = url.searchParams.get('pg')
	const failed_url = `/checkout/payment-options?order_no=${order_no}&pg=${paymentMode || pg}`
	const success_url = `/payment/success?order_no=${order_no}&pg=${paymentMode || pg}`

	try {
		// let payment_status = 'FAILED'

		// if (pg == 'razorpay') {
		if (
			!order_no ||
			order_no == null ||
			order_no == undefined ||
			order_no == 'undefined' ||
			failed == 'true'
		) {
			throw { status: 307, url: failed_url }
		}
		// }

		// if (payment_status == 'FAILED') {
		// 	throw { status: 307, url: failed_url }
		// } else {
		// payment_status = 'SUCCESS'
		if (pg !== 'Paypal') {
			// This is already done at backend for paypal
			await OrdersService.paySuccessPageHit({
				orderId,
				paymentMode,
				paymentReferenceId,
				status: payment_status,
				sid,
				storeId,
				origin: locals.origin
			})
		}

		cookies.set('cartId', null, { path: '/', expires: new Date(0) })

		throw { status: 307, url: success_url }
		// }
	} catch (e) {
		if (e.status == 307) {
			redirect(307, e.url)
		} else {
			redirect(307, failed_url)
		}
	}
}
