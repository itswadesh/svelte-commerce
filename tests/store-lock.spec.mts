import { test, expect } from '@playwright/test'

const STORE = process.env.LOCKED_STORE_URL
const PASSWORD = process.env.LOCKED_STORE_PASSWORD

test.describe('a closed store', () => {
	test.skip(!STORE || !PASSWORD, 'needs LOCKED_STORE_URL and LOCKED_STORE_PASSWORD')

	test('answers a deep address with its styled lock page, in place', async ({ page }) => {
		const response = await page.goto(`${STORE}/lock-check/two-deep`)
		expect(response?.status()).toBe(503)
		expect(response?.headers()['x-robots-tag']).toBe('noindex')
		await expect(page.getByLabel('Password')).toBeVisible()
		const sheets = await page.locator('link[rel="stylesheet"]').evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href))
		for (const sheet of sheets.filter((href) => href.startsWith(STORE!))) expect((await page.request.get(sheet)).status(), sheet).toBe(200)
	})

	test('refuses a wrong password next to the field, and the right one returns to the page asked for', async ({ page, context }) => {
		await page.goto(`${STORE}/`)
		await page.getByLabel('Password').fill('not-the-store-password')
		await page.getByRole('button', { name: 'Enter' }).click()
		await expect(page.getByText("That password isn't right.")).toBeVisible()
		expect(page.url()).toBe(`${STORE}/`)

		await page.getByLabel('Password').fill(PASSWORD!)
		const [answer] = await Promise.all([page.waitForNavigation(), page.getByRole('button', { name: 'Enter' }).click()])
		expect([answer?.status(), page.url()]).toEqual([200, `${STORE}/`])
		const pass = (await context.cookies(STORE)).find((cookie) => cookie.name.endsWith('store_pass'))
		expect([pass?.httpOnly, pass?.sameSite]).toEqual([true, 'Lax'])
	})
})
