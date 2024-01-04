// cod checkout case
import { test, expect } from '@playwright/test'
import { app_url } from './config'

test('test', async ({ page }) => {
	await page.goto(app_url)
	await page
		.locator('li')
		.filter({ hasText: 'White New Women Casual V-Neck' })
		.getByLabel('Click to view the product')
		.first()
		.click()
	await page.locator('.mb-5 > div:nth-child(2)').click()
	await page.getByRole('button', { name: 'Add to Bag' }).click()
	await page.getByRole('link', { name: 'Click to visit cart' }).click()
	await page.getByRole('button', { name: 'Select Address' }).click()
	await page.fill('input[placeholder="Enter email or mobile number"]', 'hi@litekart.in')
	await page.getByLabel('Email address').press('Tab')
	await page.getByLabel('Password').fill('litekart')
	await page.getByLabel('Password').press('Tab')
	await page.getByRole('button', { name: 'Log in' }).press('Enter')
	await page.getByRole('button', { name: 'Proceed' }).click()
	await page.locator('label').filter({ hasText: 'COD Case on delivery' }).click()
	await page.getByRole('button', { name: 'Confirm Order' }).click()
	await page.locator('label').filter({ hasText: 'COD Case on delivery' }).click()
	await page.getByRole('button', { name: 'Confirm Order' }).click()
})
