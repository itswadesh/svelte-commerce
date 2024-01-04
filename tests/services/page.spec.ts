import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'

test('Test: fetchPages', async ({ request }) => {
	const res = await request.get(`${API_URL}pages?store=${storeId}`)

	expect(res.status()).toBe(200)
})

test('Test: fetchLatestPages', async ({ request }) => {
	const res = await request.get(`${API_URL}pages?sort=-updatedAt&limit=10&store=${storeId}`)

	expect(res.status()).toBe(200)
})

test('Test: fetchPage', async ({ request }) => {
	const page_id = '6433e8d3e2c91a2ed1884489'

	const res = await request.get(`${API_URL}pages/${page_id}?store=${storeId}`)

	expect(res.status()).toBe(200)
})
