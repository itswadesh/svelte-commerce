import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/svelte'
import GoogleReviews from '$lib/composer/sections/GoogleReviews.svelte'
import { SECTIONS } from '$lib/composer/registry'
import { showSurvey, startStoreWidget } from '$lib/google-reviews'

// The registry's product grid draws the app's product card, which needs SvelteKit's runtime.
vi.mock('$lib/composer/sections/ProductGrid.svelte', () => ({ default: () => {} }))

const place = {
	rating: 4.6,
	count: 182,
	mapsUrl: 'https://maps.google.com/?cid=1',
	reviews: [
		{
			author: 'Asha R',
			authorUrl: 'https://www.google.com/maps/contrib/1',
			authorPhoto: 'https://lh3.googleusercontent.com/a/1',
			rating: 5,
			text: 'Lovely staff and quick delivery.',
			language: 'en',
			when: 'a month ago',
			visited: '2026-09',
			url: 'https://www.google.com/maps/reviews/1',
			reportUrl: 'https://www.google.com/local/review/rap/report?postId=1'
		},
		{
			author: 'Vikram',
			authorUrl: '',
			authorPhoto: '',
			rating: 1,
			text: 'पार्सल देर से आया।',
			language: 'hi',
			when: '2 months ago',
			visited: '',
			url: '',
			reportUrl: ''
		}
	]
}

const section = (settings: Record<string, unknown> = {}) => ({ id: 'g1', type: 'google-reviews', settings })

// The section asks Google only when it is about to be seen; these observers decide whether it is.
function observer(intersecting: boolean) {
	globalThis.IntersectionObserver = class {
		constructor(private cb: (entries: { isIntersecting: boolean }[]) => void) {}
		observe() {
			if (intersecting) this.cb([{ isIntersecting: true }])
		}
		unobserve() {}
		disconnect() {}
	} as unknown as typeof IntersectionObserver
}

afterEach(() => {
	observer(false)
	document.head.querySelectorAll('script').forEach((s) => s.remove())
	delete (window as any).renderOptIn
	delete (window as any).gapi
	delete (window as any).merchantwidget
})

describe('the Google reviews section', () => {
	it('is registered for the engine section type', () => {
		expect(SECTIONS['google-reviews']).toBe(GoogleReviews)
	})

	it("shows Google's rating, count and reviews with each author's attribution and Google's", async () => {
		observer(true)
		const load = vi.fn(async () => place)
		render(GoogleReviews, { section: section(), load })
		await screen.findByRole('heading', { name: 'Reviews on Google' })
		expect(load).toHaveBeenCalledTimes(1)
		expect(screen.getByText('4.6')).toBeInTheDocument()
		expect(screen.getByText('182 reviews')).toBeInTheDocument()
		expect(screen.getByRole('img', { name: 'Rated 4.6 out of 5' })).toBeInTheDocument()

		// The author by name, photo and profile link, as Google's policy asks.
		const asha = screen.getByRole('link', { name: 'Asha R' })
		expect(asha).toHaveAttribute('href', 'https://www.google.com/maps/contrib/1')
		expect(document.querySelector('img[src="https://lh3.googleusercontent.com/a/1"]')).not.toBeNull()
		// The reviewer's own words, marked with their language.
		expect(screen.getByText('पार्सल देर से आया।')).toHaveAttribute('lang', 'hi')
		// No profile link from Google: the name, not a link.
		expect(screen.getByText('Vikram').closest('a')).toBeNull()
		// The one-star review is shown like the rest.
		expect(screen.getByRole('img', { name: 'Rated 1 out of 5' })).toBeInTheDocument()

		// How the reviews were chosen, and where the rest are.
		expect(screen.getByText(/most relevant/i)).toBeInTheDocument()
		expect(screen.getByRole('link', { name: /see all reviews on google/i })).toHaveAttribute('href', 'https://maps.google.com/?cid=1')
		expect(screen.getByRole('link', { name: "Read Asha R's review on Google Maps" })).toHaveAttribute('href', 'https://www.google.com/maps/reviews/1')
		expect(screen.getByRole('link', { name: "Report Asha R's review to Google" })).toHaveAttribute(
			'href',
			'https://www.google.com/local/review/rap/report?postId=1'
		)
		expect(screen.getByRole('img', { name: 'Google Maps' })).toBeInTheDocument()
	})

	it("takes the merchant's heading", async () => {
		observer(true)
		render(GoogleReviews, { section: section({ heading: 'What customers say' }), load: async () => place })
		expect(await screen.findByRole('heading', { name: 'What customers say' })).toBeInTheDocument()
	})

	it('renders nothing at all when there is nothing from Google', async () => {
		observer(true)
		const load = vi.fn(async () => null)
		const { container } = render(GoogleReviews, { section: section(), load })
		await waitFor(() => expect(load).toHaveBeenCalled())
		await Promise.resolve()
		expect(container.querySelector('section')).toBeNull()
		expect(container.textContent?.trim()).toBe('')
	})

	it('renders nothing when the call fails', async () => {
		observer(true)
		const load = vi.fn(async () => {
			throw new Error('engine down')
		})
		const { container } = render(GoogleReviews, { section: section(), load })
		await waitFor(() => expect(load).toHaveBeenCalled())
		await Promise.resolve()
		expect(container.querySelector('section')).toBeNull()
	})

	it('does not ask Google until the section is near the screen', () => {
		observer(false)
		const load = vi.fn(async () => place)
		render(GoogleReviews, { section: section(), load })
		expect(load).not.toHaveBeenCalled()
	})
})

describe("Google Customer Reviews' scripts", () => {
	const survey = {
		merchant_id: 1234567,
		order_id: 'GC-000049',
		email: 'a@example.com',
		delivery_country: 'IN',
		estimated_delivery_date: '2026-11-04',
		opt_in_style: 'BOTTOM_TRAY'
	}

	it("renders the survey offer with the engine's fields, unchanged, loading Google's script once", () => {
		showSurvey(survey)
		showSurvey(survey)
		const scripts = document.head.querySelectorAll('script[src^="https://apis.google.com/js/platform.js"]')
		expect(scripts).toHaveLength(1)
		expect(scripts[0].getAttribute('src')).toBe('https://apis.google.com/js/platform.js?onload=renderOptIn')

		const render = vi.fn()
		;(window as any).gapi = { load: (_name: string, fn: () => void) => fn(), surveyoptin: { render } }
		;(window as any).renderOptIn()
		expect(render).toHaveBeenCalledWith(survey)
	})

	it('renders a second survey this visit, with Google already loaded', () => {
		const render = vi.fn()
		;(window as any).gapi = { load: (_name: string, fn: () => void) => fn(), surveyoptin: { render } }
		showSurvey(survey)
		showSurvey({ ...survey, order_id: 'GC-000050' })
		expect(render).toHaveBeenCalledTimes(1)
		expect(render).toHaveBeenCalledWith({ ...survey, order_id: 'GC-000050' })
	})

	it("starts Google's store widget where the store placed it", () => {
		startStoreWidget('LEFT_BOTTOM')
		const script = document.getElementById('merchantWidgetScript') as HTMLScriptElement
		expect(script.src).toBe('https://www.gstatic.com/shopping/merchant/merchantwidget.js')
		const start = vi.fn()
		;(window as any).merchantwidget = { start }
		script.dispatchEvent(new Event('load'))
		expect(start).toHaveBeenCalledWith({ position: 'LEFT_BOTTOM' })
		startStoreWidget('LEFT_BOTTOM')
		expect(document.querySelectorAll('#merchantWidgetScript')).toHaveLength(1)
	})
})
