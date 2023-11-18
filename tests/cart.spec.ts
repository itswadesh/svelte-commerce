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
