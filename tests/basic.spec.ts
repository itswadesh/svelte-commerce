import { test, expect } from '@playwright/test'
import { baseUrl } from './config'

test('test', async ({ page }) => {
	await page.goto(baseUrl)
	await page.getByRole('navigation').locator('a').filter({ hasText: 'Fashion' }).click()
	await page
		.locator('a')
		.filter({ hasText: 'Craft Colorful Design Apple iPhone 8 Mobile Cover' })
		.click()
	await page.getByRole('button', { name: 'Add to Bag' }).click()
	await page.getByRole('link', { name: 'Click to visit cart' }).click()
	await page.getByRole('button', { name: 'Select Address' }).click()
	await page.getByLabel('Email address').dblclick()
	await page.getByLabel('Email address').press('Meta+a')
	await page.getByLabel('Email address').fill('hi@litekart.in')
	await page.getByLabel('Password').click()
	await page.getByLabel('Password').fill('litekart')
	await page.getByRole('button', { name: 'Log in' }).click()
	await page.getByRole('button', { name: 'Proceed' }).click()
	await page.locator('label').filter({ hasText: 'COD Case on delivery' }).click()
	await page.getByRole('button', { name: 'Confirm Order' }).click()
	await page.getByRole('button', { name: 'View Order Details' }).click()
	await page.getByLabel('Go to home').click()
})
