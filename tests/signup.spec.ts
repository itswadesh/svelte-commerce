import { test, expect } from '@playwright/test'

import { app_url } from './config'

test('test', async ({ page }) => {
	await page.goto(`${app_url}auth/signup`)
	await page.getByLabel('First Name').dblclick()
	await page.getByLabel('First Name').fill('Demo')
	await page.getByLabel('First Name').press('Tab')
	await page.getByLabel('Last Name').fill('Name')
	await page.getByLabel('Last Name').press('Tab')
	await page.getByLabel('Phone').fill('9123456780')
	await page.getByLabel('Email').click()
	await page.getByLabel('Email').press('Meta+a')
	await page.getByLabel('Email').fill('demo-user@demo.com')
	await page.getByLabel('Email').press('Tab')
	await page.getByLabel('Password', { exact: true }).fill('12345678')
	await page.getByLabel('Password', { exact: true }).press('Tab')
	await page.getByLabel('Confirm Password').fill('12345678')
	await page.getByLabel('Confirm Password').press('Tab')
	await page.getByRole('button', { name: 'SUMBIT' }).press('Enter')
})
