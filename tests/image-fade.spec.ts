import { test, expect } from '@playwright/test'

// Pictures have no placeholder box behind them, stay clear until their file arrives and then fade
// in; with reduced motion they show at once (owner, 2026-11-25). Run against a store with
// products: `npx playwright test image-fade`.

test.use({ viewport: { width: 390, height: 844 } })

test('listing pictures have no placeholder box', async ({ request }) => {
	const html = await (await request.get('/products')).text()
	// The card pictures used to sit over a grey pulsing box.
	expect(html).not.toMatch(/class="[^"]*animate-pulse/)
})

test('a lazy picture is clear until it loads, then shown', async ({ page }) => {
	// Hold every picture back so the "before" state can be read, then let them through.
	let release!: () => void
	const held = new Promise<void>((r) => (release = r))
	await page.route(/\.(jpe?g|png|webp|avif)(\?|$)/, async (route) => {
		await held
		await route.continue()
	})
	await page.goto('/products', { waitUntil: 'domcontentloaded' })
	// The first pictures are in the server's HTML and shown at once (home-first-screen.spec.ts); one
	// further down is added as it nears the screen, once the app runs, and that one fades.
	const pending = page.locator('main img[loading="lazy"]:not([data-shown])').last()
	await expect
		.poll(async () => {
			await page.evaluate(() => scrollTo(0, document.body.scrollHeight))
			return pending.count()
		})
		.toBeGreaterThan(0)
	const lazy = (await pending.elementHandle())!
	expect(await lazy.evaluate((el) => getComputedStyle(el).opacity)).toBe('0')

	release()
	await expect.poll(() => lazy.evaluate((el) => el.hasAttribute('data-shown'))).toBe(true)
	await expect.poll(() => lazy.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
})

test('with reduced motion a pending picture is not hidden', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' })
	await page.route(/\.(jpe?g|png|webp|avif)(\?|$)/, () => {}) // never answer: every picture stays pending
	await page.goto('/products', { waitUntil: 'domcontentloaded' })
	await expect(page.locator('main img[loading="lazy"]').first()).toHaveCSS('opacity', '1')
})
