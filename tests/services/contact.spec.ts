import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'

test('Test: submit contact us form', async ({ request }) => {
	const formData = {
		fullName: 'test',
		email: 'test@test.com',
		phone: '+91045678677',
		subject: 'api test for svelte-commerce',
		message: 'contact us form test',
		store: storeId
	}

	const res = await request.post(`${API_URL}contact-us`, {
		data: JSON.stringify(formData),
		headers: {
			'Content-Type': 'application/json'
		}
	})

	expect(res.status()).toBe(200)
})
