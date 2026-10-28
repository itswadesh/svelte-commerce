import { describe, expect, it } from 'vitest'
import { aliasedPath } from '$lib/server/path-aliases'

const at = (path: string) => aliasedPath(new URL(path, 'https://shop.test'))

describe('aliasedPath', () => {
	it('sends a backend default menu link to the page the storefront has', () => {
		expect(at('/contact')).toBe('/contact-us')
		expect(at('/contact/')).toBe('/contact-us')
		expect(at('/pages/privacy')).toBe('/privacy-policy')
		expect(at('/pages/about-us')).toBe('/about-us')
		expect(at('/pages/gift-wrap')).toBe('/p/gift-wrap')
		expect(at('/search')).toBe('/products')
		expect(at('/search?q=gold ring')).toBe('/products?search=gold%20ring')
	})

	it('leaves real pages alone', () => {
		expect(at('/contact-us')).toBeNull()
		expect(at('/products')).toBeNull()
		expect(at('/pages')).toBeNull()
	})
})
