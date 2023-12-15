import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'


test('Test: save popular search', async ({ request }) => {

    const formData = {
        id: 'new',
        text: 'test',
        store: storeId
    }

    const res = await request.post(`${API_URL}popular-search`, {
        data: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    expect(res.status()).toBe(201)
})


test('Test: fetch popular search', async ({ request }) => {

    const res = await request.get(`${API_URL}popular-search?store=${storeId}&active=true`)

    expect(res.status()).toBe(200)
})