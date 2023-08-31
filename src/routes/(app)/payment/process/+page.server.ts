import { redirect } from '@sveltejs/kit'

export const prerender = false

export async function load({ url, locals, cookies }) {
	const order_no = url.searchParams.get('order_no')
	const pg = url.searchParams.get('pg')
	const failed_url = `/payment/failed?order_no=${order_no}`
	const success_url = `/payment/success?order_no=${order_no}`
	try {
		let payment_status = 'FAILED'
		if (pg == 'razorpay') {
			if (!order_no || order_no == null || order_no == undefined || order_no == 'undefined') {
				throw { status: 307, url: failed_url }
			}
			payment_status = 'SUCCESS'
		}
		if (payment_status == 'FAILED') {
			throw { status: 307, url: failed_url }
		} else {
			cookies.set('cartQty', '0', { path: '/' })
			throw { status: 307, url: success_url }
		}
	} catch (e) {
		if (e.status == 307) {
			throw redirect(307, e.url)
		} else {
			throw redirect(307, failed_url)
		}
	}
}
