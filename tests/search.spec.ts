//search case

import { test, expect } from '@playwright/test'

import { app_url } from './config'

test('test', async ({ page }) => {
	await page.goto(app_url)
	await page.getByRole('searchbox', { name: 'Search for categories, brands' }).click()
	await page.getByRole('searchbox', { name: 'Search for categories, brands' }).fill('product')
	await page.getByRole('searchbox', { name: 'Search for categories, brands' }).press('Enter')
	await page.getByRole('searchbox', { name: 'Search for categories, brands' }).fill('new')
	await page.getByRole('searchbox', { name: 'Search for categories, brands' }).press('Enter')
})
