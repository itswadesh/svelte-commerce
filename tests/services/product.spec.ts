import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'


test('Test: search products', async ({ request }) => {

    const query = 'mobiles'

    const res = await request.get(`${API_URL}es/products?${query}&store=${storeId}`)

    expect(res.status()).toBe(200)
})


test(('Test: fetch all products'), async ({ request }) => {

    const res = await request.get(`${API_URL}es/products?store=${storeId}`)

    expect(res.status()).toBe(200)
})


test('Test: fetch reels', async ({ request }) => {


    const res = await request.get(`${API_URL}reels?store=${storeId}`)

    expect(res.status()).toBe(200)
})


test('Test: fetch product by id or slug', async ({ request }) => {

    const product_id = '63d89121e2e352d94b80980c'
    const product_slug = 'craft-colorful-design-apple-iphone-8-mobile-cover'

    const res = await request.get(`${API_URL}es/products/${product_id}?store=${storeId}`)

    expect(res.status()).toBe(200)

    const res2 = await request.get(
			`${API_URL}es/products/${product_slug}?store=${storeId}`
		)

    expect(res2.status()).toBe(200)
})


test('Test: fetch product 2', async ({ request }) => {

    const product_id = '63d89121e2e352d94b80980c'
    const product_slug = 'craft-colorful-design-apple-iphone-8-mobile-cover'

    const res = await request.get(`${API_URL}es/products2/${product_id}?store=${storeId}`)
    expect(res.status()).toBe(200)

    const res2 = await request.get(`${API_URL}es/products2/${product_slug}?store=${storeId}`)
    expect(res2.status()).toBe(200)
    
})


test('Test: fetch products of category', async ({ request }) => {

    const category_slug = 'books-en-en'
    const zip = ''
    const query = 'mobiles'

    const res = await request.get(`${API_URL}es/products?categories=${category_slug}&zip=${zip}&store=${storeId}&${query}`)

    expect(res.status()).toBe(200)

})


test('Test: fetch products of next page from category', async ({ request }) => {
    
        const category_slug = 'books-en-en'
        const page = 2
        const searchParams = 'mobiles'
    
        const res = await request.get(
					`${API_URL}es/products?categories=${category_slug}&store=${storeId}&page=${page}&${searchParams}`
				)
    
        expect(res.status()).toBe(200)
})

test('Test: fetch related products from category ', async ({ request }) => {

      const category_slug = 'books-en-en'

      const res = await request.get(`${API_URL}es/products?categories=${category_slug}&store=${storeId}`)

     expect(res.status()).toBe(200)
})