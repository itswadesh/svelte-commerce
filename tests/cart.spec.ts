import { expect, test } from '@playwright/test'

test.use({
	ignoreHTTPSErrors: true,
})

test('addToCart working as expected', async ({ page }) => {
	// Navigate to the product page
	console.log('navigateToProduct')

	await page.goto('/product/white-new-women-casual-o-neck-flare-sleeve-back-lace-up-blouse-tops')

	console.log('page loaded')

 const addToBagSpan = await page.locator('span:has-text("Add to Bag")')

 console.log(addToBagSpan);
 

 // Click the "Add to Bag" span element
 await addToBagSpan.click()


	console.log('Clicked')

	// Check if the cart quantity is '1'
	const cartQuantity = await page.innerText('.cart')
	expect(cartQuantity).toBe('1')
})

test('cart qty increase working', async ({ page }) => {
	// Navigate to the cart page
	await page.goto('/cart')

	// Find the 'Add to Cart' button in the cart page and click it
	const addToCartButton = await page.locator('.addItemToCart')
	await addToCartButton.click()

	// Check if the cart item quantity is '2'
	const cartItemQuantity = await page.innerText('.cart-item')
	expect(cartItemQuantity).toBe('2')
})
