import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/svelte'
import { page } from '$app/state'
import SeoHeader from '$lib/components/seo/seo-header.svelte'

const meta = (key: string) => document.head.querySelector(`meta[property="${key}"], meta[name="${key}"]`)?.getAttribute('content') ?? null

describe('seo-header.svelte', () => {
	afterEach(() => {
		cleanup()
		document.head.innerHTML = ''
	})

	it('tells social networks a product page is a product, with its price and a picture they can fetch', () => {
		page.url = new URL('https://chillish.in/products/kakashi-anime-keychain') as typeof page.url
		page.data = { store: { name: 'Chillish', language: 'en', businessCountry: 'IN' } }
		render(SeoHeader, {
			props: {
				metaTitle: 'Kakashi Anime Keychain | CHILLISH',
				image: '/backend/media/kakashi.png',
				imageAlt: 'Kakashi keychain',
				type: 'product',
				price: 249,
				currency: 'INR',
				availability: 'https://schema.org/InStock'
			}
		})
		expect(meta('og:type')).toBe('product')
		expect(meta('og:image')).toBe('https://chillish.in/backend/media/kakashi.png')
		expect(meta('twitter:image')).toBe('https://chillish.in/backend/media/kakashi.png')
		expect(meta('og:image:alt')).toBe('Kakashi keychain')
		expect(meta('og:locale')).toBe('en_IN')
		expect(meta('product:price:amount')).toBe('249')
		expect(meta('product:price:currency')).toBe('INR')
		expect(meta('product:availability')).toBe('in stock')
		expect(meta('robots')).toBe('max-image-preview:large, max-snippet:-1, max-video-preview:-1')
		expect(meta('keywords')).toBeNull()
	})

	it('keeps an ordinary page a website, with no price, and says noindex when asked', () => {
		page.url = new URL('https://chillish.in/faqs') as typeof page.url
		page.data = { store: { name: 'Chillish', logo: '/backend/media/logo.png' } }
		render(SeoHeader, { props: { metaTitle: 'FAQs', noindex: true } })
		expect(meta('og:type')).toBe('website')
		expect(meta('og:image')).toBe('https://chillish.in/backend/media/logo.png')
		expect(meta('product:price:amount')).toBeNull()
		expect(meta('og:locale')).toBeNull()
		expect(meta('robots')).toBe('noindex, follow')
	})
})
