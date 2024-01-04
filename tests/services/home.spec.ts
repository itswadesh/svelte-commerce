import { test, expect } from '@playwright/test'
import { host, storeId, API_URL } from './config'

test('Test Fetch Home', async ({ request }) => {
	const resHome = await request.get(`${API_URL}home?store=${storeId}&pageId=home`)

	// expect resHome status code should 200

	expect(resHome.status()).toBe(200)

	// console.log('resHome', await resHome.json())
})

test('Test: fetch categories products', async ({ request }) => {
	const categories = ''

	const res = await request.get(
		`${API_URL}es/products?categories=${categories}&sort=-updatedAt&limit=20&store=${storeId}`
	)

	expect(res.status()).toBe(200)
})
