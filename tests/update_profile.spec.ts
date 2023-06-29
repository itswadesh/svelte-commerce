// login and update profile

import { test, expect } from '@playwright/test'
import { app_url } from './config'

test('test', async ({ page }) => {
	await page.goto(`${app_url}auth/login`)
    await page.getByLabel('Email address').dblclick()
	await page.getByLabel('Email address').press('Meta+a')
	await page.getByLabel('Email address').fill('hi@litekart.in')
	await page.getByLabel('Email address').press('Tab')
	await page.getByLabel('Password').fill('litekart')
	await page.getByLabel('Password').press('Tab')
	await page.getByRole('button', { name: 'Log in' }).press('Enter')
    await page.waitForURL('http://localhost:3000/')
    await page.waitForLoadState();
    await page.goto('http://localhost:3000/my/profile')
    await page.waitForLoadState()
    await page.fill('input[placeholder="Enter First Name"]', 'Ashok')
	await page.getByPlaceholder('Enter First Name').press('Tab')
    await page.fill('input[placeholder="Enter Last Name"]', 'USER')
	await page.getByRole('button', { name: 'SAVE' }).click()

})
