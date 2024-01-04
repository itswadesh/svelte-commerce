import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'

test('Test: schedule demo request', async ({ request }) => {
	const formData = {
		schedule: {
			id: 'new',
			title: 'Product Demo Request',
			scheduleDateTime: '2021-09-30T10:00:00.000Z'
		},
		store: storeId
	}

	const res = await request.post(`${API_URL}saveScheduleDemo`, {
		data: JSON.stringify(formData),
		headers: {
			'Content-Type': 'application/json'
		}
	})

	expect(res.status()).toBe(200)
})
