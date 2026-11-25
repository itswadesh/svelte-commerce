import { test, expect } from '@playwright/test'

// Pictures are in the server's HTML as lazy <img>s, have no placeholder box behind them, stay clear
// until their file arrives and then fade in; with reduced motion they show at once (owner,
// 2026-11-25). Run against a store with products: `npx playwright test image-fade`.

test.use({ viewport: { width: 390, height: 844 } })

test('listing pictures come with the page, lazily, with no placeholder', async ({ request }) => {
	const html = await (await request.get('/products')).text()
	// The card pictures used to be added only after hydration, behind an intersection gate, over a
	// grey pulsing box.
	expect(html).toMatch(/<img[^>]+loading="lazy"/)
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
	const lazy = page.locator('main img[loading="lazy"]').first()
	await expect(lazy).toHaveCSS('opacity', '0')
	expect(await lazy.getAttribute('data-shown')).toBeNull()

	release()
	await lazy.scrollIntoViewIfNeeded()
	await expect(lazy).toHaveAttribute('data-shown', '')
	await expect(lazy).toHaveCSS('opacity', '1')
})

test('with reduced motion a pending picture is not hidden', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' })
	await page.route(/\.(jpe?g|png|webp|avif)(\?|$)/, () => {}) // never answer: every picture stays pending
	await page.goto('/products', { waitUntil: 'domcontentloaded' })
	await expect(page.locator('main img[loading="lazy"]').first()).toHaveCSS('opacity', '1')
})
