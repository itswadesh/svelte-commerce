import { post } from '$lib/util/api'
import { gett } from '$lib/utils'
import { invalid, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'
export const load: PageServerLoad = async ({ locals, url }) => {
	// redirect user if logged in
	if (locals.session) {
		throw redirect(307, '/')
	}
	if (!locals.store.otpLogin) {
		const ref = url.searchParams.get('ref') || '/'
		throw redirect(307, `/auth/login?ref=${ref}`)
	}
	return { store: locals.store, origin: locals.origin }
}

const getOtp: Action = async ({ request, locals }) => {
	const data = await request.formData()
	const phone = data.get('phone')
	if (typeof phone !== 'string' || !phone) {
		return invalid(400, { invalid: true })
	}
	try {
		const data = await post(`get-otp`, { phone, store: locals.store?.id }, locals.origin)
		// const data = { timer: 1 }
		return {
			phone: phone,
			resendAfter: data?.timer,
			otpRequestSend: true
		}
	} catch (e) {
		return {}
	}
}

const verifyOtp: Action = async ({ cookies, request, locals }) => {
	const data = await request.formData()
	const phone = data.get('phone')
	const otp = data.get('otp')

	if (typeof phone !== 'string' || !phone) {
		return invalid(400, { invalid: true })
	}

	if (typeof otp !== 'string' || !otp) {
		return invalid(400, { invalid: true })
	}
	try {
		const user = await post(`verify-otp`, { phone, otp, store: locals.store?.id }, locals.origin)
		if (!user) {
			return invalid(400, { credentials: true })
		}
		const me = {
			email: user.email,
			phone: user.phone,
			firstName: user.firstName,
			lastName: user.lastName,
			avatar: user.avatar,
			role: user.role,
			verified: user.verified,
			active: user.active
		}
		cookies.set('me', JSON.stringify(me), {
			path: '/'
			// httpOnly: true,
			// sameSite: 'strict',
			// secure: process.env.NODE_ENV === 'production',
			// maxAge: 60 * 60 * 24 * 30,
		})
		cookies.set('session', user._id, {
			// send cookie for every page
			path: '/',
			// server side only cookie so you can't use `document.cookie`
			httpOnly: true,
			// only requests from same site can send cookies
			// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
			// sameSite: 'strict',
			// only sent over HTTPS in production
			secure: process.env.NODE_ENV === 'production',
			// set cookie to expire after a month
			maxAge: 60 * 60 * 24 * 30
		})
		try {
			const cartRes = await gett('carts/my', request.headers.get('cookie'))
			const cart = {
				cartId: cartRes.cart_id,
				items: cartRes.items,
				qty: cartRes.qty,
				tax: cartRes.tax,
				subtotal: cartRes.subtotal,
				total: cartRes.total,
				currencySymbol: cartRes.currencySymbol,
				discount: cartRes.discount,
				selfTakeout: cartRes.selfTakeout,
				shipping: cartRes.shipping,
				unavailableItems: cartRes.unavailableItems,
				formattedAmount: cartRes.formattedAmount
			}
			if (cart) {
				// locals.cart = cart
				locals.cartId = cart.cartId
				locals.cartQty = cart.qty
				locals.cart = cart
				cookies.set('cartId', cart.cartId, { path: '/' })
				cookies.set('cartQty', cart.qty, { path: '/' })
				// cookies.set('cart', JSON.stringify(cart), { path: '/' })
			}
		} catch (e) {
			console.log('zzzzzzzzzzzzzzzzzz', e)
		}
		// redirect the user
		redirect(307, '/')
		return {}
	} catch (e) {
		return invalid(e.status, { message: e.message, credentials: true })
	}
}

export const actions: Actions = { getOtp, verifyOtp }
