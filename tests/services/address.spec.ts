import { test, expect } from '@playwright/test'
import { host, storeId, API_URL, getCookie } from './config'

// fetch address

test('Test Fetch All Address', async ({ request }) => {
	const cookieRes = await getCookie()

	const address = await request.get(`${API_URL}addresses/my?store=${storeId}`, {
		headers: {
			cookie: cookieRes
		}
	})

	// expect address status code should 200

	expect(address.status()).toBe(200)
})

// fetch address by id

test('Test: fetch address using address id', async ({ request }) => {
	const cookieRes = await getCookie()

	const id = '656dcaa261c2bfaca1f91a9c'

	const addressByid = await request.get(`${API_URL}addresses/${id}`, {
		headers: {
			cookie: cookieRes
		}
	})

	expect(addressByid.status()).toBe(200)
})

// save new address

test('Test: save new address', async ({ request }) => {
	const cookieRes = await getCookie()

	const dummy_address = {
		id: 'new',
		address: 'New Way Area',
		city: 'Delhi',
		country: 'India',
		email: 'ashok@dummy.com',
		firstName: 'Ashok Kumar',
		lastName: 'Meena',
		phone: '+9145678907888',
		state: 'Delhi',
		zip: '110001',
		store: storeId
	}

	const addressRes = await request.post(`${API_URL}addresses`, {
		data: JSON.stringify(dummy_address),
		headers: {
			'Content-Type': 'application/json',
			cookie: cookieRes
		}
	})

	expect(addressRes.status()).toBe(201)
})

test('Test: edit existing address', async ({ request }) => {
	const cookieRes = await getCookie()

	const address = await request.get(`${API_URL}addresses/my?store=${storeId}`, {
		headers: {
			cookie: cookieRes
		}
	})

	const addressId = (await address.json()).data[0]._id

	const dummy_address = {
		id: addressId,
		address: '450, New Main Road',
		city: 'Bangalore',
		country: 'India',
		email: 'ashok@litekart.in',
		firstName: 'Ashok Kumar',
		lastName: 'Meena',
		locality: 'Near Oil Pump',
		phone: '+91987654321',
		state: 'Karnataka',
		zip: '560001',
		store: storeId
	}

	const editAddress = await request.post(`${API_URL}addresses`, {
		data: JSON.stringify(dummy_address),
		headers: {
			'Content-Type': 'application/json',
			cookie: cookieRes
		}
	})

	expect(editAddress.status()).toBe(201)
})

test('Test: delete existing address', async ({ request }) => {
	const cookieRes = await getCookie()

	const address = await request.get(`${API_URL}addresses/my?store=${storeId}`, {
		headers: {
			cookie: cookieRes
		}
	})

	const addressId = (await address.json()).data[0]._id

	const deleteAddressById = await request.delete(`${API_URL}addresses/${addressId}`, {
		headers: {
			cookie: cookieRes
		}
	})

	expect(deleteAddressById.status()).toBe(200)
})
