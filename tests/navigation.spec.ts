import { test, expect } from '@playwright/test'

test.describe('Navigation Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/')
	})

	test('should load home page', async ({ page }) => {
		await expect(page).toHaveTitle(/KitCommerce/)
	})

	test('should navigate to products page', async ({ page }) => {
		await page.click('text=Products')
		await expect(page).toHaveURL(/.*\/products/)
	})

	test('should navigate to categories', async ({ page }) => {
		await page.click('text=Categories')
		await expect(page).toHaveURL(/.*\/categories/)
	})

	test('should have working search functionality', async ({ page }) => {
		await page.fill('[placeholder*="Search"]', 'shirt')
		await page.keyboard.press('Enter')
		await expect(page).toHaveURL(/.*\?search=shirt/)
	})
})
