import { test, expect } from '@playwright/test'
import { storeId, API_URL, getCookie } from './config'



// fetch cart data

// test('Test: fetch cart Data from server', async ({ request }) => {

//     const cartId = 'a5f9f515-f031-4e3f-9a91-d348d0041c57'

// 	const cartRes = await request.get(`${API_URL}cart?store=${storeId}&cart_id=${cartId}`)

// 	expect(cartRes.status()).toBe(200)
// })

// refresh cart data
test('Test: refresh cart Data from server', async ({ request }) => {
	const cartId = 'a5f9f515-f031-4e3f-9a91-d348d0041c57'

	const cartRes = await request.get(
		`${API_URL}carts/refresh-cart?store=${storeId}&cart_id=${cartId}`
	)

	expect(cartRes.status()).toBe(200)
})

// fetch logged in user cart data

test('Test: fetch logged in user cart Data from server', async ({ request }) => {
	const cartId = 'a5f9f515-f031-4e3f-9a91-d348d0041c57'

	const cookieRes = await getCookie()

	const cartRes = await request.get(`${API_URL}carts/my?store=${storeId}&cart_id=${cartId}`, {
		headers: {
			cookie: cookieRes
		}
	})

	expect(cartRes.status()).toBe(200)
})

// add to cart

test('Test: add to cart', async ({ request }) => {

	const cartId = undefined

	const cookieRes = await getCookie()

	const cartData = {
		pid: '63d89121e2e352d94b80980c',
		vid: '63d89121e2e352d94b80980c',
		qty: 1,
		cart_id: cartId,
		store: storeId
	}

	// console.log(cartData);

	const addToCartWithCookie = await request.post(
		`${API_URL}carts/add-to-cart?store=${storeId}&cart_id=${cartId}`,
		{
			headers: {
				'Content-Type': 'application/json',
				cookie: cookieRes
			},
			data: JSON.stringify(cartData)
		}
	)

	expect(addToCartWithCookie.status()).toBe(200)

	const addToCartWithoutCookie = await request.post(
		`${API_URL}carts/add-to-cart?store=6356502aca4ff28ed596cb1b&cart_id=${cartId}`,
		{
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(cartData)
		}
	)

	expect(addToCartWithoutCookie.status()).toBe(200)
})

// create backorder
test('Test: create backorder', async ({ request }) => {
	const cookieRes = await getCookie()

	const backorderData = {
		id: 'new',
		pid: '63d89121e2e352d94b80980c',
		qty: 1,
		store: storeId
	}

	const createBackorderWithCookie = await request.post(`${API_URL}backorder`, {
		headers: {
			'Content-Type': 'application/json',
			cookie: cookieRes
		},
		data: JSON.stringify(backorderData)
	})

	expect(createBackorderWithCookie.status()).toBe(200)

	const createBackorderWithoutCookie = await request.post(`${API_URL}backorder`, {
		headers: {
			'Content-Type': 'application/json'
		},
		data: JSON.stringify(backorderData)
	})

	expect(createBackorderWithoutCookie.status()).toBe(200)
})
