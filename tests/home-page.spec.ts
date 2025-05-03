import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
	test.beforeEach(async ({ page }) => {
		// Enable network monitoring
		await page.route('**/api/**', async (route) => {
			const response = await route.fetch()
			if (!response.ok()) {
				console.error(`API Error: ${route.request().url()} - ${response.status()}`)
			}
			await route.continue()
		})

		await page.goto('/')
	})

	test('should load home page correctly', async ({ page }) => {
		// Verify page title
		await expect(page).toHaveTitle(/KitCommerce/)

		// Verify hero section is visible
		await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
	})

	test('should display featured products', async ({ page }) => {
		// Verify featured products section exists
		await expect(page.locator('[data-testid="featured-products"]')).toBeVisible()

		// Check if there are featured products
		const featuredProductCount = await page.locator('[data-testid="featured-product-card"]').count()
		expect(featuredProductCount).toBeGreaterThan(0)
	})

	test('should navigate to product detail from featured product', async ({ page }) => {
		// Click on first featured product
		await page.locator('[data-testid="featured-product-card"]').first().click()

		// Verify navigation to product detail page
		await expect(page.locator('[data-testid="product-detail"]')).toBeVisible()
	})

	test('should display categories section', async ({ page }) => {
		// Verify categories section exists
		await expect(page.locator('[data-testid="categories-section"]')).toBeVisible()

		// Check if there are category items
		const categoryCount = await page.locator('[data-testid="category-item"]').count()
		expect(categoryCount).toBeGreaterThan(0)
	})

	test('should navigate to category page', async ({ page }) => {
		// Click on first category
		await page.locator('[data-testid="category-item"]').first().click()

		// Verify navigation to category products page
		await expect(page).toHaveURL(/.*\/products\?category=/)
	})

	test('should have working search functionality', async ({ page }) => {
		// Enter search term
		await page.fill('[data-testid="search-input"]', 'shirt')

		// Submit search
		await page.press('[data-testid="search-input"]', 'Enter')

		// Verify navigation to search results
		await expect(page).toHaveURL(/.*\/products\?search=shirt/)
	})

	test('should display promotional banners', async ({ page }) => {
		// Verify promo banners section exists
		await expect(page.locator('[data-testid="promotional-banners"]')).toBeVisible()
	})
})
