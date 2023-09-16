import { expect, test } from '@playwright/test'

test('addToCart working as expected', async ({ page }) => {
	await page.goto(
		'product/white-new-fashion-women-casual-loose-comft-fit-v-neck-short-sleeve-basic-solid-t-shirt'
	)
	await page.getByText('Add to Bag').click()
	expect(await page.innerText('.cart')).toBe('1')
	// await page.getByText('Add to Bag').click()
	// expect(await page.innerText('.cart')).toBe('2')
})

test('cart qty increase working', async ({ page }) => {
	await page.goto('/cart')
	const addToCartButton = await page.$('.addItemToCart')
	await addToCartButton.click()
	expect(await page.innerText('.cart-item')).toBe('2')
})
