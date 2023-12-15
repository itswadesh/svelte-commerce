import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'

test('Test: fetch payment methods', async ({ request }) => {

    const res = await request.get(`${API_URL}payment-methods?store=${storeId}`)

    expect(res.status()).toBe(200)
})
