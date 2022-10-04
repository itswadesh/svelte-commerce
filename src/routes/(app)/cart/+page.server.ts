import { invalidateAll } from '$app/navigation'
import { fireGTagEvent } from '$lib/util/gTag'
import { gett, post } from '$lib/utils'
import { error, invalid, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, request, locals, cookies }) => {
	// const cookies = Cookie()
	let loading = false
	let cart
	try {
		loading = true
		const res = await gett('carts/refresh-cart', request.headers.get('cookie'))
		if (res) {
			cart = {
				items: res?.items,
				qty: +res?.qty,
				tax: +res?.tax,
				subtotal: +res?.subtotal,
				total: +res?.total,
				currencySymbol: res?.currencySymbol,
				discount: res?.discount,
				selfTakeout: res?.selfTakeout,
				shipping: res?.shipping,
				unavailableItems: res?.unavailableItems,
				formattedAmount: res?.formattedAmount
			}
			cookies.set('cart', JSON.stringify(cart), { path: '/' })
			locals.cart = cart
		}
	} catch (e) {
		if (e?.status === 401) {
			throw redirect(307, '/auth/otp-login')
		}
		throw error(400, e?.message || e)
	} finally {
		loading = false
	}

	// cookies.set('cache-control', 'public, max-age=200')

	return { loadingCart: loading, cart }
}

const add: Action = async ({ request, cookies }) => {
	const data = await request.formData()
	const pid = data.get('pid')
	const vid = data.get('vid')
	const qty = 1
	const options = JSON.parse(data.get('options'))
	const customizedImg = data.get('customizedImg')
	if (typeof pid !== 'string' || !pid) {
		return invalid(400, { invalid: true })
	}
	try {
		const cart = await post(
			'carts/add-to-cart',
			{
				pid,
				vid,
				qty: 1,
				options,
				customizedImg
			},
			cookies
		)
		if (cart) {
			const cookieCart = {
				items: cart?.items,
				qty: cart?.qty,
				tax: cart?.tax,
				subtotal: cart?.subtotal,
				total: cart?.total,
				currencySymbol: cart?.currencySymbol,
				discount: cart?.discount,
				selfTakeout: cart?.selfTakeout,
				shipping: cart?.shipping,
				unavailableItems: cart?.unavailableItems,
				formattedAmount: cart?.formattedAmount
			}
			cookies.set('cart', JSON.stringify(cookieCart), { path: '/' })
		}

		return cart
	} catch (e) {
		console.log('err', e)
		return {}
	}
}

export const actions: Actions = { add }
