import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'

test('Test: fetch countries', async ({ request }) => {
	const res = await request.get(`${API_URL}countries?limit=500&page=0&store=${storeId}`)

	expect(res.status()).toBe(200)
})

test('Test: fetch states', async ({ request }) => {
	const res = await request.get(
		`${API_URL}states?countryCode=IN&limit=500&page=0&sort=name&store=${storeId}`
	)

	expect(res.status()).toBe(200)
})
