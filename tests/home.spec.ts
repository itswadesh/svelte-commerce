import { test, expect } from '@playwright/test'
import { baseUrl } from './config'

test('test', async ({ page }) => {
	await page.goto(baseUrl)
	await page.getByText('Welcome to the store...have a great time.').click()
})
