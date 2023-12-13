import { test, expect } from '@playwright/test'
import { host, storeId, API_URL } from './config'

test('Test Fetch Home', async ({ request }) => {
	// const host = 'demo.litekart.in'

	// const res = await request.get(`${API_URL}init?domain=${host}`)

	// const storeData = await res.json()

	// // expect status code should 200
	// expect(res.status()).toBe(200)

	const resHome = await request.get(`${API_URL}home?store=${storeId}&pageId=home`)

	// expect resHome status code should 200

	expect(resHome.status()).toBe(200)

	// console.log('resHome', await resHome.json())
})
