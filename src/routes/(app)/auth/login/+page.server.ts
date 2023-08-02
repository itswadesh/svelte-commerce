
const login = async ({ request, cookies, locals }) => {
	const data = await request.formData()
	const email = data.get('email')
	const password = data.get('password')
	
	const res = await UserService.loginService({
		email: email,
		password: password
	})
	console.log('55555555555555555555', email, password, res)
}

export const actions = { login }
