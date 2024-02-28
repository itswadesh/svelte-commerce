import { test, expect } from '@playwright/test'
import { host, storeId, API_URL } from './config'

test('Test Menu Services', async ({ request }) => {
	// const host = 'demo.litekart.in'

	// const res = await request.get(`${API_URL}init?domain=${host}`)

	// const storeData = await res.json()

	// // expect status code should 200
	// expect(res.status()).toBe(200)

	const menus = await request.get(`${API_URL}menus?active=true&store=${storeId}`)

	// expect menus status code should 200

	expect(menus.status()).toBe(200)
})
