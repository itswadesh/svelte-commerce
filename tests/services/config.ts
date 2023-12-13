export const host = 'demo.litekart.in'
export const API_URL = 'https://staging.litekart.in/api/'
export const storeId = '6356502aca4ff28ed596cb1b'





export const getCookie = async () => {

	const data = {
		email: 'hi@litekart.in',
		password: 'litekart',
		store: storeId
	}

	// console.log(JSON.stringify(data));

	// const opts =

	const resLogin = await fetch(`${API_URL}login`, {
		method: 'POST',
		body: JSON.stringify(data || {}),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const cookie = resLogin.headers.getSetCookie()[0]
	return cookie
}