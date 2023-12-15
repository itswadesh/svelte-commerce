import { test, expect } from '@playwright/test'
import { storeId, API_URL, getCookie } from './config'

test('Test: fetch reviews', async ({ request }) => {
	const sort = 'updatedAt'
	const currentPage = 0
	const search = ''

	const res = await request.get(
		`${API_URL}es/reviews?search=${search || ''}&sort=${sort}&page=${currentPage}&store=${storeId}`
	)
	expect(res.status()).toBe(200)

})

test('Test: fetch product reviews', async ({ request }) => {
    const slug = 'craft-colorful-design-apple-iphone-8-mobile-cover'
    const page = 1

    const res = await request.get(
        `${API_URL}reviews/product-reviews?slug=${slug}&page=${page}&sort=-createdAt&store=${storeId}`
    )
    expect(res.status()).toBe(200)
})

test('Test: save a review', async ({ request }) => {

    const cookieRes = await getCookie()

    const formData = {
			id: 'new',
			images: [],
			rating: 1,
			oid: '00741',
			pid: '63d89121e2e352d94b80980c',
			message: 'test review',
			store: storeId
		}

    const res = await request.post(`${API_URL}reviews`, {
			data: JSON.stringify(formData),
			headers: {
				'Content-Type': 'application/json',
				cookie: cookieRes
			}
		})

    expect(res.status()).toBe(200)
})