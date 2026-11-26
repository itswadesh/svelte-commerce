import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { page } from '$app/state'

vi.mock('@misiki/kitcommerce-core/utils', () => ({ getImageCDNUrl: (src: string) => src }))
vi.mock('$lib/composer/chrome-draft.svelte.js', () => ({
	chromeMenuItems: (_id: string, menus: any[]) => menus?.find((m) => m.menuId === 'header')?.items ?? []
}))

const { default: MainNav } = await import('$lib/components/nav/main-nav.svelte')

const menu = [
	{
		menuId: 'header',
		items: [
			{ name: 'Home', link: '/', items: [] },
			{
				name: 'Women',
				link: '/women',
				items: [
					{ name: 'Ethnic wear', link: '/women-ethnic-wear', items: [{ name: 'Sarees', link: '/women-sarees', items: [] }] },
					{ name: 'Western wear', link: '/women-western-wear', items: [{ name: 'Dresses', link: '/women-dresses', items: [] }] }
				]
			},
			{ name: 'Men', link: '/men', items: [{ name: 'Ethnic wear', link: '/men-ethnic-wear', items: [] }] }
		]
	}
]

beforeEach(() => {
	page.data = { store: { menu } }
})

// Clicks the link and reports whether the menu kept the browser from following it. The follow
// itself is cancelled afterwards, since jsdom cannot navigate.
function click(el: Element, detail: number) {
	let prevented = false
	const see = (e: Event) => {
		prevented = e.defaultPrevented
		e.preventDefault()
	}
	document.addEventListener('click', see, { once: true })
	el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail }))
	return prevented
}

// jsdom has no PointerEvent, so the pointer type is set by hand.
function press(el: Element, pointerType: string) {
	el.dispatchEvent(Object.assign(new Event('pointerdown', { bubbles: true }), { pointerType }))
}

const trigger = (name: string) => screen.getByRole('link', { name, expanded: false }) as HTMLAnchorElement

describe('desktop mega menu', () => {
	it('server-renders every panel link, with View all, and links each trigger to its panel', () => {
		const { container } = render(MainNav)
		const women = trigger('Women')
		const panel = container.querySelector(`#${CSS.escape(women.getAttribute('aria-controls')!)}`)!
		expect(panel.getAttribute('role')).toBe('region')
		expect(panel.getAttribute('aria-label')).toBe('Women')
		const links = [...panel.querySelectorAll('a')].map((a) => a.getAttribute('href'))
		expect(links).toEqual(['/women-ethnic-wear', '/women-sarees', '/women-western-wear', '/women-dresses', '/women'])
		expect(panel.textContent).toContain('View all Women')
	})

	it('opens on Enter, then follows the link on the second Enter', async () => {
		render(MainNav)
		const women = trigger('Women')
		expect(click(women, 0)).toBe(true)
		await Promise.resolve()
		expect(women.getAttribute('aria-expanded')).toBe('true')
		expect(click(women, 0)).toBe(false)
	})

	it('a first tap opens and a mouse click follows at once', async () => {
		render(MainNav)
		const men = trigger('Men')
		press(men, 'touch')
		expect(click(men, 1)).toBe(true)
		const women = trigger('Women')
		press(women, 'mouse')
		expect(click(women, 1)).toBe(false)
	})

	it('keeps one panel open at a time', async () => {
		render(MainNav)
		const women = trigger('Women')
		const men = trigger('Men')
		await fireEvent.keyDown(women, { key: ' ' })
		await fireEvent.keyDown(men, { key: ' ' })
		expect(women.getAttribute('aria-expanded')).toBe('false')
		expect(men.getAttribute('aria-expanded')).toBe('true')
	})

	it('ArrowDown enters the panel, arrows move through it, Escape closes and returns to the trigger', async () => {
		render(MainNav)
		const women = trigger('Women')
		women.focus()
		await fireEvent.keyDown(women, { key: 'ArrowDown' })
		await new Promise((r) => setTimeout(r))
		expect(women.getAttribute('aria-expanded')).toBe('true')
		expect(document.activeElement?.getAttribute('href')).toBe('/women-ethnic-wear')
		await fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
		expect(document.activeElement?.getAttribute('href')).toBe('/women-sarees')
		await fireEvent.keyDown(document.activeElement!, { key: 'End' })
		expect(document.activeElement?.getAttribute('href')).toBe('/women')
		await fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
		expect(women.getAttribute('aria-expanded')).toBe('false')
		expect(document.activeElement).toBe(women)
	})

	it('ArrowRight and ArrowLeft move between top items', async () => {
		render(MainNav)
		const home = screen.getByRole('link', { name: 'Home' })
		home.focus()
		await fireEvent.keyDown(home, { key: 'ArrowRight' })
		expect(document.activeElement).toBe(trigger('Women'))
		await fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' })
		expect(document.activeElement).toBe(home)
	})

	it('closes on a click outside', async () => {
		render(MainNav)
		const women = trigger('Women')
		await fireEvent.keyDown(women, { key: ' ' })
		expect(women.getAttribute('aria-expanded')).toBe('true')
		await fireEvent.click(document.body)
		expect(women.getAttribute('aria-expanded')).toBe('false')
	})
})
