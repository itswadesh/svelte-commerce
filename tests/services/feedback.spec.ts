import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'

test('Test: fetch top reviews', async ({ request }) => {
	const res = await request.get(`${API_URL}reviews/top?store=${storeId}`)

	expect(res.status()).toBe(200)
})
