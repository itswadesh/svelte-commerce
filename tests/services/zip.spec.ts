import { test, expect } from '@playwright/test'
import { storeId, API_URL, getCookie } from './config'

test('Test: fetch zip code details', async ({ request }) => {
	const zip = '560095'

	const res = await request.get(`${API_URL}pincodes/${zip}`)

	expect(res.status()).toBe(200)
})

test('Test: fetch zip code by city', async ({ request }) => {
	const cookieRes = await getCookie()

	const q = 'Jaipur'

	const res = await request.get(`${API_URL}pincodes?${q}`, {
		headers: {
			cookie: cookieRes
		}
	})

	expect(res.status()).toBe(200)
})

test('Test: group zip code by city', async ({ request }) => {
	const cookieRes = await getCookie()

	const res = await request.get(`${API_URL}pincodes/group-by-city`, {
		headers: {
			cookie: cookieRes
		}
	})

	expect(res.status()).toBe(200)
})

test('Test: group zip code by state', async ({ request }) => {
	const cookieRes = await getCookie()

	const res = await request.get(`${API_URL}pincodes/group-by-state`, {
		headers: {
			cookie: cookieRes
		}
	})

	expect(res.status()).toBe(200)
})
