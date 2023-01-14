import { error, redirect } from '@sveltejs/kit'
import { getBySid, gett } from '$lib/utils'
import razorpayIcon from '$lib/assets/razorpay-icon.jpg'

export const prerender = false

export async function load({ params, parent, locals, url, request, cookies }) {
	const { me } = locals
	if (!me) {
		const redirectUrl = `${locals.store?.loginUrl || '/auth/login'}?ref=${url?.pathname}`
		throw redirect(307, redirectUrl)
	}
	const cartRes = await getBySid(`carts/refresh-cart?store=${locals.store?.id}`, cookies.get('sid'))
	const cart = {
		cartId: cartRes.cart_id,
		items: cartRes.items,
		qty: cartRes.qty,
		tax: cartRes.tax,
		subtotal: cartRes.subtotal,
		total: cartRes.total,
		currencySymbol: cartRes.currencySymbol,
		discount: cartRes.discount,
		savings: cartRes.savings,
		selfTakeout: cartRes.selfTakeout,
		shipping: cartRes.shipping,
		unavailableItems: cartRes.unavailableItems,
		formattedAmount: cartRes.formattedAmount
	}
	locals.cart = cart
	try {
		const addressId = url.searchParams.get('address')

		// const paymentMethods = [
		// 	{
		// 		active: true,
		// 		name: 'Cash on Delivery',
		// 		value: 'cod',
		// 		img: 'https://cdn-icons-png.flaticon.com/512/2331/2331895.png',
		// 		color: '',
		// 		position: 1,
		// 		key: '',
		// 		text: 'Pay the full amount when item is delivered',
		// 		type: 'cod'
		// 	},
		// 	{
		// 		active: true,
		// 		name: 'Online with Cashfree',
		// 		value: 'cashfree',
		// 		img: 'https://misiki.s3.ap-south-1.amazonaws.com/img/cashfree.jpg',
		// 		color: '',
		// 		position: 2,
		// 		key: '',
		// 		text: 'Pay the full amount with online / UPI / Wallets / Credit Cards / Debit Cards',
		// 		type: 'pg'
		// 	},
		// 	{
		// 		active: true,
		// 		name: 'Online with Razorpay',
		// 		value: 'razorpay',
		// 		img: razorpayIcon,
		// 		color: '',
		// 		position: 3,
		// 		key: '',
		// 		text: 'Pay the full amount with online / UPI / Wallets / Credit Cards / Debit Cards',
		// 		type: 'pg'
		// 	}
		// ]

		const address = await gett(`addresses/${addressId}`, request.headers.get('cookie'))
		const paymentMethods = (
			await gett(
				`payment-methods?store=${locals.store?.id}&active=true`,
				request.headers.get('cookie')
			)
		).data

		// if (paymentMethods) {

		return { paymentMethods, address, addressId, me, cart }
		// }
	} catch (e) {
		if (e) {
			throw redirect(307, '/checkout/address')
		}
		// throw error(e.status || 400, e?.message)
	}
}
