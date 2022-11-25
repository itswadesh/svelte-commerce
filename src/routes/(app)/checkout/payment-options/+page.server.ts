import { getAPI } from '$lib/util/api'
import { gett } from '$lib/utils'
import { error, redirect } from '@sveltejs/kit'
export const prerender = false

export async function load({ params, parent, locals, url, request }) {
	const { me, cart } = locals
	if (!me) {
		const redirectUrl = `/auth/otp-login?ref=${url?.pathname}`
		throw redirect(307, redirectUrl)
	}
	try {
		const addressId = url.searchParams.get('address')

		const paymentMethods = [
			{
				active: true,
				name: 'Cash on Delivery',
				value: 'cod',
				img: 'https://cdn-icons-png.flaticon.com/512/2331/2331895.png',
				color: '',
				position: 1,
				key: '',
				text: 'Pay the full amount when item is delivered',
				type: 'cod',
				img: 'https://cdn-icons-png.flaticon.com/512/2331/2331895.png'
			},
			{
				active: true,
				name: 'Online with Cashfree',
				value: 'cashfree',
				img: 'https://misiki.s3.ap-south-1.amazonaws.com/img/cashfree.jpg',
				color: '',
				position: 2,
				key: '',
				text: 'Pay the full amount with online / UPI / Wallets / Credit Cards / Debit Cards',
				type: 'pg',
				img: 'https://ik.imagekit.io/3wzatecz51w3i/s3/img/cashfree.jpg'
			},
			{
				active: true,
				name: 'Online with Razorpay',
				value: 'razorpay',
				img: '/razorpay-icon.jpg',
				color: '',
				position: 3,
				key: '',
				text: 'Pay the full amount with online / UPI / Wallets / Credit Cards / Debit Cards',
				type: 'pg',
				img: '/razorpay-icon.jpg'
			}
		]
		const address = await gett(`addresses/${addressId}`, request.headers.get('cookie'))

		// if (paymentMethods) {
		if (!address || !addressId) {
			throw redirect(307, '/checkout/address')
		}
		return { paymentMethods, address, addressId, me, cart }
		// }
	} catch (e) {
		if (e) {
			throw redirect(307, '/checkout/address')
		}
		// throw error(e.status || 400, e?.message)
	}
}
