import { test, expect } from '@playwright/test'
import { host, storeId, API_URL } from './config'

test('Test Init Services', async ({ request }) => {
	// const host = 'demo.litekart.in'

	const res = await request.get(`${API_URL}init?domain=${host}`)

	const storeData = await res.json()

	// expect status code should 200
	expect(res.status()).toBe(200)

	// expect response json should contain the domain name

	expect(storeData?.storeOne?.domain).toBe(host)

	expect(storeData?.storeOne?._id).toBe(storeId)
})
