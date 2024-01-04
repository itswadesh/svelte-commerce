import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'

test('Test: fetch Deals', async ({ request }) => {
	const res = await request.get(`${API_URL}deals?store=${storeId}`)

	expect(res.status()).toBe(200)
})
