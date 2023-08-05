import { UserService } from '$lib/services'

const login = async ({ request, cookies, locals }) => {
	const data = await request.formData()
	const isEmail = data.get('isEmail')
	const phoneOrEmail = data.get('phoneOrEmail')
	const password = data.get('password')

	let res

	if (isEmail == 'true') {
		res = await UserService.loginService({
			email: phoneOrEmail,
			password: password,
			storeId: locals.store?.id,
			cookies,
			server: true,
			origin: locals.origin
		})

		console.log('res of email login = ', res)
	} else {
		res = await UserService.getOtpService({
			phone: phoneOrEmail,
			storeId: locals.store?.id,
			server: true,
			origin: locals.origin
		})

		console.log('res of phone login = ', res)
	}

	return res
}

export const actions = { login }
