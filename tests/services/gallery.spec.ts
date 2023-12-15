import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'


test('Test: fetch galley images', async ({ request }) => {

    const res = await request.get(`${API_URL}gallery?store=${storeId}`)
    
    expect(res.status()).toBe(200)
})

