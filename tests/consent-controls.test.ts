import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import { tick } from 'svelte'
import { page } from '$app/state'

vi.mock('$lib/core/utils/index.js', () => ({ cn: (...classes: unknown[]) => classes.filter(Boolean).join(' ') }))
vi.mock('$lib/core/services/index.js', () => ({ pageService: {} }))
// jsdom has no Web Animations.
vi.mock('$lib/motion', () => ({ fade: () => ({ duration: 0 }), fly: () => ({ duration: 0 }) }))

const { default: CookieSettingsLink } = await import('$lib/components/common/cookie-settings-link.svelte')
const { default: ConsentBanner } = await import('$lib/components/common/consent-banner.svelte')

const GOOGLE = { googleTagManager: { active: true, tags: ['G-ABC123XYZ'] } }

beforeEach(() => {
	localStorage.clear()
	page.data = {}
})

describe('Cookie settings', () => {
	it('is offered only on a store that loads a tag', () => {
		page.data = { store: { plugins: { googleTagManager: { active: false } } } }
		const { unmount } = render(CookieSettingsLink)
		expect(screen.queryByRole('button', { name: 'Cookie settings' })).toBeNull()
		unmount()

		page.data = { store: { plugins: GOOGLE } }
		render(CookieSettingsLink)
		expect(screen.getByRole('button', { name: 'Cookie settings' })).toBeInTheDocument()
	})

	it('opens the banner again for a shopper who already chose, and a new choice is passed on', async () => {
		page.data = { store: { plugins: GOOGLE } }
		localStorage.setItem('user_consent', JSON.stringify({ ad_storage: 'granted', analytics_storage: 'granted' }))
		render(ConsentBanner)
		render(CookieSettingsLink)
		expect(screen.queryByRole('region', { name: 'Cookie consent' })).toBeNull()

		await fireEvent.click(screen.getByRole('button', { name: 'Cookie settings' }))
		await tick()
		const banner = screen.getByRole('region', { name: 'Cookie consent' })
		expect(document.activeElement).toBe(banner)

		const chose = vi.fn()
		window.addEventListener('consentchange', (e) => chose((e as CustomEvent).detail), { once: true })
		await fireEvent.click(screen.getByRole('button', { name: 'Required only' }))
		expect(chose).toHaveBeenCalledWith({ ad_storage: 'denied', analytics_storage: 'denied' })
		expect(JSON.parse(localStorage.getItem('user_consent')!)).toEqual({ ad_storage: 'denied', analytics_storage: 'denied' })
	})
})
