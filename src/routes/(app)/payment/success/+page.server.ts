import { getBySid, post } from '$lib/utils/server'
import { error, redirect } from '@sveltejs/kit'

export const prerender = false

export async function load({ url, request, locals, cookies }) {
	const orderId = url.searchParams.get('id')
	const status = url.searchParams.get('status')
	const paymentMode = url.searchParams.get('provider')
	let loading, err, order, cart
	// const getPaySuccessPageHit = async () => {
	try {
		loading = true
		// request.headers.set('content-type', 'application/json')

		const res = await post(
			`orders/pay-sucess-page-hit`,
			{
				paymentMode: paymentMode,
				status: status,
				orderId: orderId,
				store: locals.store?.id
			},
			cookies
		)

		order = res
	} catch (e) {
		if (e.status === 401) {
			throw redirect(307, locals.store?.loginUrl)
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
	// }

	// const refreshCart = async () => {
	try {
		cart = await getBySid(`carts/refresh-cart?store=${locals.store?.id}`, cookies.get('sid'))
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
			cookies.set('cartId', cartObj.cartId, { path: '/' })
			cookies.set('cartQty', cartObj.qty, { path: '/' })
		}
	} catch (e) {}

	// }
	return { loading, status, paymentMode, order, err, cart }
}
