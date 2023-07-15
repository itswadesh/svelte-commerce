import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'



test('Test: fetchCollections', async ({ request }) => {
    
    const res = await request.get(`${API_URL}collections?store=${storeId}`)
    
    expect(res.status()).toBe(200)

})