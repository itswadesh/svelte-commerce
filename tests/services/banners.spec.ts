import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'

test('Test: Fetch Banners', async ({ request }) => {
	const pageId = 'home'

	const bannerRes = await request.get(
		`${API_URL}banners?pageId=${pageId}&store=${storeId}&active=true`
	)

	expect(bannerRes.status()).toBe(200)
})

test('Test: Fetch Banners by groups', async ({ request }) => {
	const pageId = 'home'

	const bannerRes = await request.get(
		`${API_URL}banners?pageId=${pageId}&store=${storeId}&active=true`
	)

	expect(bannerRes.status()).toBe(200)
})
