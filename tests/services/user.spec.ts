import { test, expect } from '@playwright/test'
import { host, storeId, API_URL, randomPhone, randomEmail, getCookie } from './config'


// console.log('randomPhone', randomPhone)
// console.log('randomEmail', randomEmail)


test('Test: user login flow ', async ({ request }) => {

	const data = {
		email: 'hi@litekart.in',
		password: 'litekart',
		store: storeId
	}

	const res = await request.post(`${API_URL}login`, {
		data: JSON.stringify(data || {}),
		headers: {
			'Content-Type': 'application/json'
		}
	})

	expect(res.status()).toBe(200)
})

test('Test: user registration flow ', async ({ request }) => {

	// please change the email address before running this test

	const formData = {
		email: randomEmail,
		firstName: 'test',
		lastName: 'test',
		phone: randomPhone,
		password: 'test1234',
		passwordConfirmation: 'test1234',
		store: storeId
	}

	const res = await request.post(`${API_URL}signup`, {
		data: JSON.stringify(formData || {}),
		headers: {
			'Content-Type': 'application/json'
		}
	})

	expect(res.status()).toBe(200)
})


test('Test: user forgot password flow ', async ({ request }) => {
	
	const formData = {
		email: 'hi@litekart.com',
		referrer: host,
		store: storeId
	}

	const res = await request.post(`${API_URL}users/forgot-password`, {
		data: JSON.stringify(formData || {}),
		headers: {
			'Content-Type': 'application/json'
		}
	})

	expect(res.status()).toBe(200)
})


test('Test: user change password flow ', async ({ request }) => {

	const cookieRes = await getCookie()

	const formData ={
		oldPassword: 'litekart',
		password: 'litekart',
		passwordConfirmation: 'litekart',
		store: storeId
	}

	const res = await request.post(`${API_URL}users/change-password`, {
		data: JSON.stringify(formData || {}),
		headers: {
			'Content-Type': 'application/json',
			cookie: cookieRes
		}
	})

	expect(res.status()).toBe(200)
})



test('Test: user reset password flow ', async ({ request }) => {

	// please change the token before running this test

	const formData = {
		id: 'new',
		token: 'new',
		password: 'litekart',
		passwordConfirmation: 'litekart',
		store: storeId
	}

	const res = await request.post(`${API_URL}users/reset-password`, {
		data: JSON.stringify(formData || {}),
		headers: {
			'Content-Type': 'application/json'
		}
	})

	expect(res.status()).toBe(200)
})



test('Test: get otp on phone number ', async ({ request }) => {

	// please change the phone number before running this test
	
	const formData = {
		phone: randomPhone || '',
		store: storeId
	}

	const res = await request.post(`${API_URL}get-otp`, {
		data: JSON.stringify(formData || {}),
		headers: {
			'Content-Type': 'application/json'
		}
	})

	expect(res.status()).toBe(201)
})


test('Test: verify otp on phone number ', async ({ request }) => {

// please change the otp and phone number before running this test
	
	const formData = {
		phone: '1234567890',
		otp: '1234',
		store: storeId
	}

	const res = await request.post(`${API_URL}verify-otp`, {
		data: JSON.stringify(formData || {}),
		headers: {
			'Content-Type': 'application/json'
		}
	})

	expect(res.status()).toBe(200)
})



test('Test: get user profile ', async ({ request }) => {
	
	const cookieRes = await getCookie()

	const res = await request.get(`${API_URL}users/me?store=${storeId}`, {
		headers: {
			'Content-Type': 'application/json',
			cookie: cookieRes
		}
	})

	expect(res.status()).toBe(200)
})

test('Test: update user profile ', async ({ request }) => {

	const cookieRes = await getCookie()

	const formData = {
		firstName: 'test',
		lastName: 'test',
		phone: randomPhone,
		store: storeId
	}

	const res = await request.put(`${API_URL}users/update-profile`, {
		data: JSON.stringify(formData || {}),
		headers: {
			'Content-Type': 'application/json',
			cookie: cookieRes
		}
	})

	expect(res.status()).toBe(200)
})


test('Test: logout user ', async ({ request }) => {
	
	const cookieRes = await getCookie()

	const formData = {
		store: storeId
	}

	const res = await request.post(`${API_URL}logout?store=${storeId}`, {
		data: JSON.stringify(formData || {}),
		headers: {
			'Content-Type': 'application/json',
			cookie: cookieRes
		}
	})

	expect(res.status()).toBe(200)
})


test('Test: verify email address ', async ({ request }) => {

	// please change id and token and signautre before running this test

	const formData = {
		id: 'new',
		expires: 'new',
		signature: 'new',
		token: 'new',
		store: storeId
	}

	const res = await request.post(`${API_URL}verify-email`, {
		data: JSON.stringify(formData || {}),
		headers: {
			'Content-Type': 'application/json'
		}
	})

	expect(res.status()).toBe(200)
})