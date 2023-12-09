import { expect, test } from '@playwright/test'
import { app_url } from './config'

test.use({
	ignoreHTTPSErrors: true
})

test('addToCart working as from home page', async ({ page }) => {
	await page.goto(app_url)
	await page
		.locator('li')
		.filter({
			hasText: 'Khaki Women Casual Long Sleeve V Neck Patchwork Slim Pullover T Shirt $ 53.00 $ '
		})
		.getByLabel('Click to view the product details')
		.first()
		.click()
	await page.getByRole('button', { name: 'Add to Bag' }).click()
	await page.getByRole('link', { name: 'Click to visit cart' }).click()
})

test('add to bag from product page', async ({ page }) => {
	// Navigate to the cart page
	await page.goto(`${app_url}product/khaki-women-casual-long-sleeve-v-neck-patchwork-slim-pullover-t-shirt`)
	await page.getByRole('button', { name: 'Add to Bag' }).click()
	await page.getByRole('button', { name: 'Add to Bag' }).click()
	await page.getByRole('link', { name: 'Click to visit cart' }).click()
	//   await page.getByText('(3 items )').click();
})




//add to cart and remove from cart


test('test', async ({ page }) => {
	await page.goto('http://localhost:3000/')
	await page.locator('a').filter({ hasText: 'White New Women Casual V-Neck' }).click()
	await page.getByRole('button', { name: 'Add to Bag' }).click()
	await page
		.locator('li')
		.filter({ hasText: 'White New Women O-Neck Flare' })
		.getByLabel('Click to view the product')
		.first()
		.click()
	await page.getByRole('navigation').locator('a').filter({ hasText: 'Books' }).click()
	await page
		.locator('li')
		.filter({
			hasText: 'Craft Colorful Design Apple iPhone 8 Mobile Cover By Fashion Gallery $ 99.00 $'
		})
		.getByLabel('Click to view the product')
		.first()
		.click()
	await page.getByRole('button', { name: 'Add to Bag' }).click()
	await page.getByRole('link', { name: 'Click to visit cart' }).click()
	await page.locator('.mt-2 > form > .flex').first().click()
	await page.locator('.mt-2 > form > .flex').click()
})
