import { describe, expect, it, vi } from 'vitest'

// Which shop each call is for, as the connector reads it from the request host.
let shop = 'a'
const published: Record<string, string[]> = { a: ['privacy-policy'], b: ['about-us'] }
const list = vi.fn(async () => ({ data: published[shop].map((slug) => ({ slug })) }))
vi.mock('$lib/core/services/index.js', () => ({ pageService: { list, getOne: vi.fn() } }))

const { isCmsPageResolvable, keepResolvableLinks, publishedCmsSlugs } = await import('$lib/components/common/cms-pages')

describe('keepResolvableLinks', () => {
	// A new GoCommerce store's footer: six standard pages, all drafts until the merchant publishes.
	const footer = [
		{ name: 'About us', link: '/about-us' },
		{ name: 'Contact us', link: '/contact-us' },
		{ name: 'Privacy policy', link: '/privacy-policy' },
		{ name: 'Terms and conditions', link: '/terms-and-conditions' },
		{ name: 'Shipping policy', link: '/shipping-policy' },
		{ name: 'Refund and returns policy', link: '/refund-policy' }
	]

	it('hides every page the store has not published, and never the contact form', () => {
		expect(keepResolvableLinks(footer, []).map((l) => l.link)).toEqual(['/contact-us'])
		expect(keepResolvableLinks(footer, ['privacy-policy', 'refund-policy']).map((l) => l.link)).toEqual([
			'/contact-us',
			'/privacy-policy',
			'/refund-policy'
		])
	})

	it('knows those pages under the names a backend menu uses', () => {
		// An older store's default footer, and a page item as the connector writes it.
		const links = [
			{ name: 'Privacy policy', link: '/pages/privacy' },
			{ name: 'About', link: '/p/about-us' },
			{ name: 'Terms', link: '/terms-and-conditions/' },
			{ name: 'Gift wrap', link: '/p/gift-wrap' },
			{ name: 'Search', link: '/search' },
			{ name: 'Blog', link: 'https://blog.example/about-us' }
		]
		expect(keepResolvableLinks(links, []).map((l) => l.name)).toEqual(['Gift wrap', 'Search', 'Blog'])
		expect(keepResolvableLinks(links, ['privacy-policy', 'about-us', 'terms-and-conditions'])).toHaveLength(6)
	})

	it('leaves a malformed link to the router rather than throwing', () => {
		expect(isCmsPageResolvable('/pages/%E0', [])).toBe(true)
	})
})

describe('publishedCmsSlugs', () => {
	it('answers each shop with its own pages', async () => {
		shop = 'a'
		expect(await publishedCmsSlugs('a.example')).toEqual(['privacy-policy'])
		shop = 'b'
		expect(await publishedCmsSlugs('b.example')).toEqual(['about-us'])
		// Remembered: asking shop a again does not ask the backend.
		expect(await publishedCmsSlugs('a.example')).toEqual(['privacy-policy'])
		expect(list).toHaveBeenCalledTimes(2)
	})

	it('picks up a page published since, once the minute is up', async () => {
		vi.useFakeTimers({ now: Date.now() })
		shop = 'a'
		published.a = ['privacy-policy', 'about-us']
		expect(await publishedCmsSlugs('a.example')).toEqual(['privacy-policy'])
		vi.advanceTimersByTime(61_000)
		expect(await publishedCmsSlugs('a.example')).toEqual(['privacy-policy', 'about-us'])
		vi.useRealTimers()
	})
})
