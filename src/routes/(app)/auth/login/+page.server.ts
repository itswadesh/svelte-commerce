import { UserService } from '$lib/services'
import { error, fail } from '@sveltejs/kit'

const login = async ({ request, cookies, locals }) => {
	const data = await request.formData()
	const isEmail = data.get('isEmail')
	const phoneOrEmail = data.get('phoneOrEmail')
	const password = data.get('password')

	let res

	try {

		if (isEmail == 'true') {
			res = await UserService.loginService({
				email: phoneOrEmail,
				password: password,
				storeId: locals.store?.id,
				cartId: locals.cartId,
				server: true,
				origin: locals.origin
			})

			// const updatedCart = await CartService.updateCart({
			// 	customer_id: res.customer_id
			// })

			// console.log('res of email login = ', updatedCart)
		} else {
			res = await UserService.getOtpService({
				phone: phoneOrEmail,
				storeId: locals.store?.id,
				server: true,
				origin: locals.origin
			})

			// console.log('res of phone login = ', res)
		}
		cookies.set('connect.sid', res.sid, {
			path: '/'
		})

		return res
	} catch (e) {
		throw error(404, e?.body?.message)
	}
}

const verifyOtp = async ({ cookies, request, locals, url }) => {
	const data = await request.formData()
	const otp = data.get('otp')
	const phone = data.get('phone')

	if (typeof phone !== 'string' || !phone) {
		return fail(400, { invalid: true })
	}

	if (typeof otp !== 'string' || !otp) {
		return fail(400, { invalid: true })
	}
	try {
		const user = await UserService.verifyOtpService({
			phone,
			otp,
			cartId: cookies.get('cartId'),
			isCors: locals.store?.isCors,
			origin: locals.origin,
			sid: locals.sid,
			storeId: locals.store?.id
		})

		if (!user) {
			return fail(400, { credentials: true })
		}

		const me = {
			id: user._id,
			email: user.email,
			phone: user.phone,
			firstName: user.firstName,
			lastName: user.lastName,
			avatar: user.avatar,
			role: user.role,
			verified: user.verified,
			active: user.active,
			store: user.store
		}

		cookies.set('connect.sid', user.sid, { path: '/' })

		cookies.set('me', JSON.stringify(me), {
			path: '/'
			// httpOnly: true,
			// sameSite: 'strict',
			// secure: process.env.NODE_ENV === 'production',
			// maxAge: 60 * 60 * 24 * 30,
		})

		// cookies.set('session', user._id, {
		// 	// send cookie for every page
		// 	path: '/',
		// 	// server side only cookie so you can't use `document.cookie`
		// 	httpOnly: true,
		// 	// only requests from same site can send cookies
		// 	// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
		// 	// sameSite: 'strict',
		// 	// only sent over HTTPS in production
		// 	secure: process.env.NODE_ENV === 'production',
		// 	// set cookie to expire after a month
		// 	maxAge: 60 * 60 * 24 * 30
		// })

		return me
	} catch (e) {
		return fail(e.status, { message: e.body?.message, credentials: true })
	}
}

export const actions = { login, verifyOtp }
