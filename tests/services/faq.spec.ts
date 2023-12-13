import { test, expect } from '@playwright/test'
import { host, storeId, API_URL } from './config'

test('Test Fetch FAQ', async ({ request }) => {
	// const host = 'demo.litekart.in'

	// const res = await request.get(`${API_URL}init?domain=${host}`)

	// const storeData = await res.json()

	// // expect status code should 200
	// expect(res.status()).toBe(200)

	const resFaq = await request.get(`${API_URL}faqs?store=${storeId}`)

	// expect resFaq status code should 200

	expect(resFaq.status()).toBe(200)

	// console.log('resFaq', await resFaq.json())
})
