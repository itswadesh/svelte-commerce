import { test, expect } from '@playwright/test'
import { storeId, API_URL, getCookie } from './config'

test('Test: move unavailable items to wishlists', async ({ request }) => {
	const cookieRes = await getCookie()

	const formData = {
		store: storeId
	}

	const res = await request.post(
		`${API_URL}wishlists/move-unavailable-items-to-wishlist?store=${storeId}`,
		{
			data: JSON.stringify(formData || {}),
			headers: {
				'Content-Type': 'application/json',
				cookie: cookieRes
			}
		}
	)

	expect(res.status()).toBe(200)
})

test('Test: fetch wishlist', async ({ request }) => {
	const cookieRes = await getCookie()

	const search = ''
	const sort = '-createdAt'
	const currentPage = 1

	const res = await request.get(
		`${API_URL}wishlists/my?search=${
			search || ''
		}&sort=${sort}&page=${currentPage}&store=${storeId}`,
		{
			headers: {
				'Content-Type': 'application/json',
				cookie: cookieRes
			}
		}
	)

	expect(res.status()).toBe(200)
})



test('Test: check wishlist', async ({ request }) => {
    const cookieRes = await getCookie()

    const pid = '63d89121e2e352d94b80980c'
    const vid = '63d89121e2e352d94b80980c'

    const res = await request.get(
        `${API_URL}wishlists/check?product=${pid}&variant=${vid}&store=${storeId}`,
        {
            headers: {
                'Content-Type': 'application/json',
                cookie: cookieRes
            }
        }
    )

    expect(res.status()).toBe(200)
})


test('Test: add to wishlist', async ({ request }) => {
    const cookieRes = await getCookie()

    const formData = {
        product: '63d89121e2e352d94b80980c',
        variant: '63d89121e2e352d94b80980c',
        store: storeId
    }

    const res = await request.post(`${API_URL}wishlists/toggle`, {
			data: JSON.stringify(formData || {}),
			headers: {
				'Content-Type': 'application/json',
				cookie: cookieRes
			}
		})

    expect(res.status()).toBe(200)
})