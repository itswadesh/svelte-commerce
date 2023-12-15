import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'


test('Test: update popularity of product', async ({ request }) => {
    
        const formData = {
					pid: '63d89121e2e352d94b80980c',
					store: storeId
				}
    
        const res = await request.post(`${API_URL}update-popularity`, {
            data: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    
        expect(res.status()).toBe(200)
})