// login test case

import { test, expect } from '@playwright/test'

import { app_url } from './config'

test('test', async ({ page }) => {
	await page.goto(`${app_url}auth/login`)
	await page.getByLabel('Email address').dblclick()
	await page.getByLabel('Email address').fill('hi@litekart.in')
	await page.getByLabel('Email address').press('Tab')
	await page.getByLabel('Password').fill('litekart')
	await page.getByRole('button', { name: 'Log in' }).click()
})