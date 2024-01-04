import { test, expect } from '@playwright/test'
import { host, storeId, API_URL } from './config'

test('Test Fetch All Category', async ({ request }) => {
	const categories = await request.get(`${API_URL}categories?store=${storeId}`)

	// expect categories status code should 200

	expect(categories.status()).toBe(200)

	// console.log('categories', await categories.json())
})

test('Test Fetch MegaMenu', async ({ request }) => {
	const megamenu = false

	const resMegamenu = await request.get(
		`${API_URL}categories/megamenu?megamenu=${megamenu}&store=${storeId}&active=true`
	)

	// expect resMegamenu status code should 200

	expect(resMegamenu.status()).toBe(200)

	// console.log('megamenu', await resMegamenu.json())
})

test('Test Fetch Category', async ({ request }) => {
	// const host = 'demo.litekart.in'

	const res = await request.get(`${API_URL}init?domain=${host}`)

	const storeData = await res.json()

	// expect status code should 200
	expect(res.status()).toBe(200)

	const children = true

	//static id for books-en-en category

	const id = '63b8f1fee497e2c0976880f5'

	const resCategory = await request.get(
		`${API_URL}es/categories/${id}?store=${storeId}&children=${children}`
	)

	// expect resCategory status code should 200

	expect(resCategory.status()).toBe(200)

	// console.log('categories', await resCategory.json())
})
