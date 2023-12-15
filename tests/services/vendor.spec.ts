import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'


test('Test: fetch vendors list', async ({ request }) => {
    
    const res = await request.get(`${API_URL}vendors?store=${storeId}`)
    
    expect(res.status()).toBe(200)
})

test('Test: fetch vendor details', async ({ request }) => {
    
    const slug = 'litekart'
    const res = await request.get(`${API_URL}vendors/${slug}?store=${storeId}`)
    
    expect(res.status()).toBe(200)
})


test('Test: fetch vendor products', async ({ request }) => {
    
    const slug = 'litekart'
    const page = 1
    const res = await request.get(`${API_URL}es/products?vendors=${slug}&page=${page}&store=${storeId}`)
    
    expect(res.status()).toBe(200)
})