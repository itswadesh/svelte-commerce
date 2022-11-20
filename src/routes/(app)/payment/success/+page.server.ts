import { CartService, OrdersService } from '$lib/services'
import { error, redirect } from '@sveltejs/kit'

export const prerender = false

export async function load({ url, request, locals, cookies }) {
	const cartId = cookies.get('cartId')
	const orderId = url.searchParams.get('orderId') || url.searchParams.get('order_no')
	const paymentMode = url.searchParams.get('provider')
	const paymentReferenceId = url.searchParams.get('payment_reference_id')
	const sid = cookies.get('connect.sid')
	const status = url.searchParams.get('status')
	const storeId = locals.store?.id

	let cart
	let err
	let loading
	let order
	try {
		loading = true

		order = await OrdersService.paySuccessPageHit({
			paymentMode,
			status,
			orderId,
			paymentReferenceId,
			storeId,
			server: true,
			sid
		})

		cookies.set('cartQty', '0', { path: '/' })
		locals.cartQty = 0
	} catch (e) {
		// console.log('error at payment success page', e);

		if (e.status === 401) {
			throw redirect(307, '/auth/login')
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

	try {
		cart = await CartService.fetchRefreshCart({
			cartId,
			storeId,
			sid,
			origin: locals.origin
		})

		if (cart) {
			const cartObj = {
				cartId: cart?.cart_id,
				items: cart?.items,
				qty: cart?.qty,
				tax: cart?.tax,
				subtotal: cart?.subtotal,
				total: cart?.total,
				currencySymbol: cart?.currencySymbol,
				discount: cart?.discount,
				savings: cart?.savings,
				selfTakeout: cart?.selfTakeout,
				shipping: cart?.shipping,
				unavailableItems: cart?.unavailableItems,
				formattedAmount: cart?.formattedAmount
			}

			locals.cartId = cartObj.cartId
			locals.cartQty = cartObj.qty
			locals.cart = cartObj
			// cookies.set('cartId', cartObj.cartId, { path: '/' })
			cookies.set('cartQty', JSON.stringify(cartObj.qty), { path: '/' })
		}
	} catch (e) {
		// console.log('error at payment success page cart', e);
	}

	return { loading, status, paymentMode, order, err, cart }
}
