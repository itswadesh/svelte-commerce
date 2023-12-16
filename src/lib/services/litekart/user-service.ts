import { getAPI, post, put } from '$lib/utils/api'
import { getBySid, postBySid } from '$lib/utils/server'
import { error } from '@sveltejs/kit'
const isServer = import.meta.env.SSR

export const fetchMeData = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		if (isServer) {
			res = await getBySid(`users/me?store=${storeId}`, sid)
		} else {
			res = await getAPI(`users/me?store=${storeId}`, origin)
		}

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const signupService = async ({
	firstName,
	lastName,
	phone,
	email,
	password,
	passwordConfirmation,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`signup`,
			{
				firstName,
				lastName,
				phone,
				email,
				password,
				passwordConfirmation,
				store: storeId
			},
			origin
		)

		return res
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const googleOneTapLoginService = async ({
	data,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await post(`auth/google/onetap`, data, origin)

		return res
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const loginService = async ({ email, password, storeId, origin, sid = null }: any) => {
	try {
		let res: any = {}

		res = await postBySid(
			`login`,
			{
				email,
				password,
				store: storeId
			},
			sid
		)

		return res
	} catch (e) {
		if (e.status === 401) e.message = 'email or password is invalid'
		error(e.status, e.data?.message || e.message)
	}
}

export const forgotPasswordService = async ({
	email,
	referrer,
	storeId,
	origin,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`users/forgot-password`,
			{
				email,
				referrer,
				store: storeId
			},
			origin
		)

		return res
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const resetPasswordService = async ({
	id,
	token,
	password,
	passwordConfirmation,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`users/reset-password`,
			{
				id,
				token,
				password,
				passwordConfirmation,
				store: storeId
			},
			origin
		)

		return res
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
export const changePasswordService = async ({
	oldPassword,
	password,
	passwordConfirmation,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`users/change-password`,
			{
				oldPassword,
				password,
				passwordConfirmation,
				store: storeId
			},
			origin
		)

		return res
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const getOtpService = async ({
	firstName,
	lastName,
	phone,
	email,
	password,
	passwordConfirmation,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`get-otp`,
			{
				phone,
				store: storeId
			},
			origin
		)

		return res
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const verifyOtpService = async ({
	phone,
	otp,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`verify-otp`,
			{
				phone,
				otp,
				store: storeId
			},
			origin
		)

		return res
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const logoutService = async ({ storeId, origin, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await postBySid(`logout?store=${storeId}`, {}, sid)

		return res
	} catch (e) {
		error(e?.status || 500, e.data?.message || e.message)
	}
}

export const updateProfileService = async ({
	storeId,
	e,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await put(`users/update-profile`, e, origin)

		return res
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const verifyEmail = async ({
	id,
	expires,
	signature,
	token,
	origin,
	sid = null,
	storeId
}) => {
	try {
		let res = {}

		if (isServer) {
			res = await postBySid(
				`verify-email`,
				{
					id,
					expires,
					signature,
					token,
					store: storeId
				},
				sid
			)
		} else {
			res = await post(
				`verify-email`,
				{
					id,
					expires,
					signature,
					token,
					store: storeId
				},
				origin
			)
		}

		return res
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
