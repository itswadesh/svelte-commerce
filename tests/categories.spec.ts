//categories page case

import { test, expect } from '@playwright/test'

import { app_url } from './config'

test('test', async ({ page }) => {
	await page.goto(`${app_url}categories`)
	await page.getByLabel('Click to visit Books').click()
})
