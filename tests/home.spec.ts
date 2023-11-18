import { test, expect } from '@playwright/test'
import { app_url } from './config'

test('test', async ({ page }) => {
	await page.goto(app_url)
	await page.getByText('Welcome to the store...have a great time.').click()
})
