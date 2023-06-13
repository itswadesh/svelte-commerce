import { CartService } from '$lib/services'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, request, locals, cookies, depends }) => {
	depends('cart:my')
	let loading = false
	let cart = locals.cart
	try {
		loading = true
		const res = await CartService.fetchRefreshCart({
			storeId: locals.store?.id,
			sid: cookies.get('connect.sid'),
			server: true,
			origin: locals.origin
		})
		if (res) {
			cart = {
				cartId: res?.cart_id,
				items: res?.items,
				qty: res?.qty,
				tax: +res?.tax,
				subtotal: +res?.subtotal,
				total: +res?.total,
				currencySymbol: res?.currencySymbol,
				discount: res?.discount,
				savings: res?.savings,
				selfTakeout: res?.selfTakeout,
				shipping: res?.shipping,
				unavailableItems: res?.unavailableItems,
				formattedAmount: res?.formattedAmount
			}

			cookies.set('cartId', cart.cartId, { path: '/' })
			cookies.set('cartQty', cart.qty, { path: '/' })
			// cookies.set('cart', JSON.stringify(cart), { path: '/' })
			locals.cartId = cart.cartId
			locals.cartQty = cart.qty
			locals.cart = cart
		}
	} catch (e) {
		if (e?.status === 401) {
			throw redirect(307, '/auth/login')
		}
		throw error(400, e?.body?.message || e)
	} finally {
		loading = false
	}

	return { loadingCart: loading, cart }
}

const add: Action = async ({ request, cookies, locals }) => {
	const data = await request.formData()
	const pid = data.get('pid')
	const vid = data.get('pid')
	const qty = data.get('qty')
	const linkedItems = JSON.parse(data.get('linkedItems'))
	const options = JSON.parse(data.get('options')) //data.get('options') //
	const customizedImg = data.get('customizedImg')
	const sid = cookies.get('connect.sid')
	if (typeof pid !== 'string' || !pid) {
		return fail(400, { invalid: true })
	}
	try {
		let cart = await CartService.addToCartService({
			pid,
			vid,
			qty,
			options,
			customizedImg,
			storeId: locals.store?.id,
			server: true,
			origin: locals.origin,
			cookies // This is a special case to pass complete cookie
		})
		if (linkedItems?.length) {
			for (const i of linkedItems) {
				cart = await CartService.addToCartService({
					pid: i,
					vid: i,
					qty: 1,
					storeId: locals.store?.id,
					server: true,
					origin: locals.origin,
					cookies // This is a special case to pass complete cookie
				})
			}
		}
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
			locals.cart = cartObj
			locals.cartId = cartObj.cartId
			locals.cartQty = cartObj.qty
			cookies.set('cartId', cartObj.cartId, { path: '/' })
			cookies.set('cartQty', cartObj.qty, { path: '/' })
			return cartObj
		} else {
			return {}
		}
	} catch (e) {
		return {}
	}
}

export const actions: Actions = { add }
