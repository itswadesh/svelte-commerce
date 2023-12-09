import { test, expect } from '@playwright/test'
import { host, storeId, API_URL } from './config'

test('Test login ', async ({ request }) => {
	// const host = 'demo.litekart.in'

	// const res = await request.get(`${API_URL}init?domain=${host}`)

	// const storeData = await res.json()

	// // expect status code should 200
	// expect(res.status()).toBe(200)

	const data = {
		email: 'hi@litekart.in',
		password: 'litekart',
		store: storeId
	}

    // console.log(JSON.stringify(data));
    
    

	// const opts = 

	const resLogin = await request.post(`${API_URL}login`, {
		data: JSON.stringify(data || {}),
		headers: {
			'Content-Type': 'application/json'
		}
	})

	// expect resLogin status code should 200

	expect(resLogin.status()).toBe(200)

	// console.log('resLogin', await resLogin.json())
})
