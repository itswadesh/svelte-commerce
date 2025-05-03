import { test, expect } from '@playwright/test'

test.describe('Cart Functionality', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/products')
	})

	test('should add item to cart', async ({ page }) => {
		// Wait for products to load
		await page.waitForSelector('[data-testid="product-card"]')

		// Click add to cart on the first product
		const firstProduct = await page.locator('[data-testid="product-card"]').first()
		const productName = await firstProduct.locator('[data-testid="product-name"]').textContent()
		await firstProduct.locator('button:has-text("Add to Cart")').click()

		// Verify cart notification
		await expect(page.locator('text=Item added to cart')).toBeVisible()

		// Go to cart
		await page.click('[data-testid="cart-icon"]')

		// Verify item is in cart
		await expect(page.locator(`text=${productName}`)).toBeVisible()
	})

	test('should update cart quantity', async ({ page }) => {
		// Add item to cart first
		await page.waitForSelector('[data-testid="product-card"]')
		await page.locator('[data-testid="product-card"]').first().locator('button:has-text("Add to Cart")').click()

		// Go to cart
		await page.click('[data-testid="cart-icon"]')

		// Increase quantity
		await page.click('[data-testid="increase-quantity"]')

		// Verify quantity is updated
		await expect(page.locator('[data-testid="item-quantity"]')).toHaveValue('2')
	})

	test('should remove item from cart', async ({ page }) => {
		// Add item to cart first
		await page.waitForSelector('[data-testid="product-card"]')
		await page.locator('[data-testid="product-card"]').first().locator('button:has-text("Add to Cart")').click()

		// Go to cart
		await page.click('[data-testid="cart-icon"]')

		// Remove item
		await page.click('[data-testid="remove-item"]')

		// Verify cart is empty
		await expect(page.locator('text=Your cart is empty')).toBeVisible()
	})
})
