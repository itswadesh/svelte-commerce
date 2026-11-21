import { test, expect } from '@playwright/test'

test.describe('Product Listing', () => {
	test.beforeEach(async ({ page }) => {
		// Enable network monitoring
		await page.route('**/api/**', async (route) => {
			const response = await route.fetch()
			if (!response.ok()) {
				console.error(`API Error: ${route.request().url()} - ${response.status()}`)
			}
			await route.continue()
		})

		await page.goto('/products')
	})

	test('should load product listing page', async ({ page }) => {
		// Wait for products to load
		await page.waitForSelector('[data-testid="product-card"]')

		// Verify product grid is visible
		await expect(page.locator('[data-testid="product-grid"]')).toBeVisible()

		// Verify at least one product card is present
		const productCards = await page.locator('[data-testid="product-card"]').count()
		expect(productCards).toBeGreaterThan(0)
	})

	test('should display product information correctly', async ({ page }) => {
		await page.waitForSelector('[data-testid="product-card"]')

		// Get first product card
		const firstProduct = await page.locator('[data-testid="product-card"]').first()

		// Verify product details are present
		await expect(firstProduct.locator('[data-testid="product-name"]')).toBeVisible()
		await expect(firstProduct.locator('[data-testid="product-price"]')).toBeVisible()
		await expect(firstProduct.locator('[data-testid="product-image"]')).toBeVisible()
	})

	test('should handle pagination', async ({ page }) => {
		await page.waitForSelector('[data-testid="product-card"]')

		// Click next page
		await page.click('[data-testid="pagination-next"]')

		// Verify URL has changed
		await expect(page).toHaveURL(/.*page=2/)

		// Verify products are loaded
		await page.waitForSelector('[data-testid="product-card"]')
	})

	test('should handle empty product list', async ({ page }) => {
		// Navigate to a category that should be empty
		await page.goto('/products?category=non-existent')

		// Verify empty state message
		await expect(page.locator('text=No products found')).toBeVisible()
	})
})
