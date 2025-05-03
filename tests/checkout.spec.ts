import { test, expect } from '@playwright/test'

test.describe('Checkout Process', () => {
	test.beforeEach(async ({ page }) => {
		// Start from products page
		await page.goto('/products')

		// Add an item to cart
		await page.waitForSelector('[data-testid="product-card"]')
		await page.locator('[data-testid="product-card"]').first().locator('button:has-text("Add to Cart")').click()

		// Go to cart
		await page.click('[data-testid="cart-icon"]')
	})

	test('should proceed to checkout', async ({ page }) => {
		// Click checkout button
		await page.click('[data-testid="checkout-button"]')

		// Verify we're on the checkout page
		await expect(page).toHaveURL(/.*\/checkout/)
	})

	test('should fill shipping information', async ({ page }) => {
		await page.click('[data-testid="checkout-button"]')

		// Fill shipping form
		await page.fill('[data-testid="shipping-name"]', 'Test User')
		await page.fill('[data-testid="shipping-email"]', 'test@example.com')
		await page.fill('[data-testid="shipping-address"]', '123 Test St')
		await page.fill('[data-testid="shipping-city"]', 'Test City')
		await page.fill('[data-testid="shipping-postal"]', '12345')
		await page.fill('[data-testid="shipping-country"]', 'Test Country')

		// Submit shipping information
		await page.click('[data-testid="continue-to-payment"]')

		// Verify we moved to payment section
		await expect(page.locator('text=Payment Information')).toBeVisible()
	})

	test('should complete payment process', async ({ page }) => {
		await page.click('[data-testid="checkout-button"]')

		// Fill shipping info
		await page.fill('[data-testid="shipping-name"]', 'Test User')
		await page.fill('[data-testid="shipping-email"]', 'test@example.com')
		await page.fill('[data-testid="shipping-address"]', '123 Test St')
		await page.fill('[data-testid="shipping-city"]', 'Test City')
		await page.fill('[data-testid="shipping-postal"]', '12345')
		await page.fill('[data-testid="shipping-country"]', 'Test Country')
		await page.click('[data-testid="continue-to-payment"]')

		// Fill payment info (using test card)
		await page.fill('[data-testid="card-number"]', '4242424242424242')
		await page.fill('[data-testid="card-expiry"]', '12/25')
		await page.fill('[data-testid="card-cvc"]', '123')

		// Complete order
		await page.click('[data-testid="complete-order"]')

		// Verify order confirmation
		await expect(page.locator('text=Order Confirmed')).toBeVisible()
		await expect(page.locator('text=Thank you for your purchase')).toBeVisible()
	})
})
