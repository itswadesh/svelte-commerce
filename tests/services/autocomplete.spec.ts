import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'

test('Test: check autocomplete', async ({ request }) => {
	const q = 'a'

	const autocomplete = await request.get(`${API_URL}es/autocomplete?store=${storeId}&q=${q}`)

	expect(autocomplete.status()).toBe(200)
})
