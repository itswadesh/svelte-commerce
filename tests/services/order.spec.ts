import { test, expect } from '@playwright/test'
import { storeId, API_URL, getCookie } from './config'


test('Test: fetch all orders', async ({ request }) => {

    const cookieRes = await getCookie()

    const res = await request.get(`${API_URL}orders/my?store=${storeId}&active=true`, {
        headers: {
            cookie: cookieRes
        }
    })
    
    expect(res.status()).toBe(200)
})


test('Test: fetch order', async ({ request }) => {
    
        const cookieRes = await getCookie()

        const orderNo = '00741'
    
        const res = await request.get(`${API_URL}orders/${orderNo}?store=${storeId}`, {
					headers: {
						cookie: cookieRes
					}
				})
        
        expect(res.status()).toBe(200)
})


test('Test: fetch track order', async ({ request }) => {
        
            const cookieRes = await getCookie()
    
            const orderNo = '00741'
        
            const res = await request.get(`${API_URL}order-tracking/${orderNo}?store=${storeId}`, {
                        headers: {
                            cookie: cookieRes
                        }
                    })
            
            expect(res.status()).toBe(200)
})