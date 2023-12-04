//product listing page case

import { test, expect } from '@playwright/test'

import { app_url } from './config'

test('test', async ({ page }) => {
	await page.goto(app_url)
	await page
		.getByText('New Fashion Women Chain Decored One Shoulder Short Batwing Sleeve Blouse $ 2,')
		.click()
	await page.getByText('Cosmetic').nth(1).click()
	await page
		.locator('li')
		.filter({ hasText: 'Craft Colorful Design Apple' })
		.getByLabel('Click to view the product')
		.first()
		.click()
})
