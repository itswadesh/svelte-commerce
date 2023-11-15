import { fail, redirect } from '@sveltejs/kit'
import { UserService, CartService } from '$lib/services'
import type { Action, Actions, PageServerLoad } from './$types'

const getOtp: Action = async ({ request, locals }) => {
	const data = await request.formData()
	const phone = data.get('phone')
	if (typeof phone !== 'string' || !phone) {
		return fail(400, { invalid: true })
	}
	try {
		const data = await UserService.getOtpService({
			phone,
			storeId: locals.storeId,
			origin: locals.origin
		})

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
		return fail(400, { invalid: true })
	}

	if (typeof otp !== 'string' || !otp) {
		return fail(400, { invalid: true })
	}
	try {
		const user = await UserService.verifyOtpService({
			phone,
			otp,
			storeId: locals.storeId,
			origin: locals.origin
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
		// redirect the user
		redirect(307, '/')
		return {}
	} catch (e) {
		return fail(e.status, { message: e.message, credentials: true })
	}
}

export const actions: Actions = { getOtp, verifyOtp }
