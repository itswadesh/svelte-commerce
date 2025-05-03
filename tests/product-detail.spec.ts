import { test, expect } from '@playwright/test'

test.describe('Product Detail', () => {
	test.beforeEach(async ({ page }) => {
		// Enable network monitoring
		await page.route('**/api/**', async (route) => {
			const response = await route.fetch()
			if (!response.ok()) {
				console.error(`API Error: ${route.request().url()} - ${response.status()}`)
			}
			await route.continue()
		})

		// Navigate to products page first
		await page.goto('/products')

		// Wait for products to load and click on first product
		await page.waitForSelector('[data-testid="product-card"]')
		await page.locator('[data-testid="product-card"]').first().click()

		// Wait for product detail page to load
		await page.waitForSelector('[data-testid="product-detail"]')
	})

	test('should display product details correctly', async ({ page }) => {
		// Verify essential product information is visible
		await expect(page.locator('[data-testid="product-title"]')).toBeVisible()
		await expect(page.locator('[data-testid="product-price"]')).toBeVisible()
		await expect(page.locator('[data-testid="product-description"]')).toBeVisible()
		await expect(page.locator('[data-testid="product-image"]')).toBeVisible()
	})

	test('should have working add to cart button', async ({ page }) => {
		// Click add to cart button
		await page.click('[data-testid="add-to-cart-button"]')

		// Verify success message is shown
		await expect(page.locator('text=Added to cart')).toBeVisible()
	})

	test('should display related products', async ({ page }) => {
		// Scroll to related products section
		await page.locator('[data-testid="related-products"]').scrollIntoViewIfNeeded()

		// Verify related products are visible
		await expect(page.locator('[data-testid="related-products"]')).toBeVisible()

		// Check if there's at least one related product
		const relatedProductCount = await page.locator('[data-testid="related-product-item"]').count()
		expect(relatedProductCount).toBeGreaterThan(0)
	})

	test('should display product variants if available', async ({ page }) => {
		// Check if variants exist
		const hasVariants = await page.locator('[data-testid="product-variants"]').isVisible()

		if (hasVariants) {
			// Select a different variant
			await page.locator('[data-testid="variant-option"]').nth(1).click()

			// Verify variant selection is updated
			await expect(page.locator('[data-testid="selected-variant"]')).toBeVisible()
		} else {
			// Skip test if no variants
			test.skip()
		}
	})
})
