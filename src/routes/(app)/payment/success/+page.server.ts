import { CartService, OrdersService } from '$lib/services'
import { error, redirect } from '@sveltejs/kit'

export const prerender = false

export async function load({ url, request, locals, cookies }) {
	const cartId = locals.cartId
	const orderId = url.searchParams.get('orderId')
	const paymentMode = url.searchParams.get('provider')
	const paymentReferenceId = url.searchParams.get('payment_reference_id')
	const sid = cookies.get('connect.sid')
	const status = url.searchParams.get('status')

	let cart
	let err
	let loading
	let order

	try {
		loading = true

		order = await OrdersService.paySuccessPageHit({
			cartId,
			paymentMode,
			status,
			orderId,
			paymentReferenceId,
			storeId: locals.store?.id,
			server: true,
			sid
		})
			cookies.set('cartQty', '0', { path: '/' })

		if (order.id) throw { status: 307, url: `/my/orders/${order.id}` }
	} catch (e) {
		err = e

		if (e.status == 307) {
			throw redirect(307, e.url)
		}
		if (e.status === 401) {
			throw redirect(307, locals.store?.loginUrl)
		}
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
			cookies,
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('connect.sid'),
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

			locals.cartId = cart.cartId
			locals.cartQty = cart.qty
			locals.cart = cartObj
			// cookies.set('cartId', cartObj.cartId, { path: '/' })
			cookies.set('cartQty', cartObj.qty, { path: '/' })
		}
	} catch (e) { }

	return { loading, status, paymentMode, order, err, cart }
}
