import { test, expect } from '@playwright/test'
import { storeId, API_URL, getCookie } from './config'

test('Test: fetch product discount', async ({ request }) => {
	const cookieRes = await getCookie()

	const pid = '63d89121e2e352d94b80980c'

	const res = await request.get(`${API_URL}products/check-discount/${pid}?store=${storeId}`, {
		headers: {
			cookie: cookieRes
		}
	})

	expect(res.status()).toBe(200)
})
