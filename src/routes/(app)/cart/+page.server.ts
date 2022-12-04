import { invalidateAll } from '$app/navigation'
import { fireGTagEvent } from '$lib/util/gTag'
import { getBySid, gett, post } from '$lib/utils'
import { error, invalid, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, request, locals, cookies }) => {
	// const cookies = Cookie()
	let loading = false
	let cart = locals.cart
	try {
		loading = true
		const res = await getBySid(`carts/refresh-cart?store=${locals.store?.id}`, cookies.get('sid'))
		// console.error(
		// 	'Refresh cart called at cart.server page...',
		// 	res.cart_id,
		// 	res.qty,
		// 	res.items.length
		// )

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
		// console.log('Error at /cart/+page.server.ts page.....', e)
		if (e?.status === 401) {
			throw redirect(307, '/auth/otp-login')
		}
		throw error(400, e?.message || e)
	} finally {
		loading = false
	}

	return { loadingCart: loading, cart }
}

const add: Action = async ({ request, cookies, locals }) => {
	const data = await request.formData()
	const pid = data.get('pid')
	const vid = data.get('pid')
	const linkedItems = JSON.parse(data.get('linkedItems'))
	const options = JSON.parse(data.get('options')) //data.get('options') //
	const customizedImg = data.get('customizedImg')
	if (typeof pid !== 'string' || !pid) {
		return invalid(400, { invalid: true })
	}
	try {
		let cart = await post(
			'carts/add-to-cart',
			{
				pid,
				vid,
				qty: 1,
				options,
				customizedImg,
				store: locals.store?.id
			},
			cookies
		)
		if (linkedItems?.length) {
			for (const i of linkedItems) {
				cart = await post(
					'carts/add-to-cart',
					{
						pid: i,
						vid: i,
						qty: 1,
						store: locals.store?.id
					},
					cookies
				)
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
			// cookies.set('cart', JSON.stringify(cartObj), { path: '/' })
			return cartObj
		} else {
			return {}
		}
	} catch (e) {
		// console.log('err', e)
		return {}
	}
}

export const actions: Actions = { add }
