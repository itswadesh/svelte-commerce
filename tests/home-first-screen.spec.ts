import { test, expect } from '@playwright/test'

// The home page's first product cards show their pictures without any scroll and before the app's
// code has run (owner, 2026-11-27: "until I scroll, products are not visible"). The pictures used to
// be added only by an observer that exists after hydration, seconds after first paint on a phone.
// Run against a store whose home page lists products: `npx playwright test home-first-screen`.

for (const width of [390, 1440]) {
	test(`home at ${width}px shows its first product pictures before hydration, unscrolled`, async ({ page }) => {
		await page.setViewportSize({ width, height: width < 500 ? 844 : 900 })
		// Hold the app's code back for good: what the shopper sees until hydration is what is tested.
		await page.route(/\/_app\/immutable\/.*\.js(\?|$)/, () => {})
		await page.goto('/', { waitUntil: 'domcontentloaded' })

		const pictures = page.locator('main a[href*="/products/"] img')
		await expect(pictures.first()).toBeAttached()
		const count = Math.min(await pictures.count(), width < 500 ? 2 : 4)
		for (let i = 0; i < count; i++) {
			const img = pictures.nth(i)
			await expect(img).toHaveCSS('opacity', '1')
			await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
		}
		// And nothing on the first screen is left blank: every picture in view has arrived and shows.
		expect(await page.evaluate(() => scrollY)).toBe(0)
		await expect
			.poll(() =>
				page.evaluate(() =>
					[...document.querySelectorAll<HTMLImageElement>('main img')]
						.filter((img) => {
							const box = img.getBoundingClientRect()
							return box.width > 0 && box.top < innerHeight && box.bottom > 0
						})
						.filter((img) => !img.complete || !img.naturalWidth || getComputedStyle(img).opacity !== '1')
						.map((img) => img.alt || img.src)
				)
			)
			.toEqual([])
	})
}
