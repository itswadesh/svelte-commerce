import { describe, expect, it } from 'vitest'
import { aliasedPath, finalLocs } from '$lib/path-aliases'

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
		expect(at('/pages/faq')).toBe('/faqs')
		expect(at('/pages/faqs')).toBe('/faqs')
		expect(at('/cart')).toBe('/checkout/cart')
	})

	it('leaves real pages alone', () => {
		expect(at('/contact-us')).toBeNull()
		expect(at('/products')).toBeNull()
		expect(at('/pages')).toBeNull()
	})

	it("lists a sitemap's pages at the addresses that answer them, not at redirects", () => {
		const xml = [
			'<url><loc>https://demo.shopnx.in/pages/about</loc></url>',
			'<url><loc>https://demo.shopnx.in/pages/returns</loc></url>',
			'<url><loc>https://demo.shopnx.in/pages/gift-wrap</loc></url>',
			'<url><loc>https://demo.shopnx.in/products/satin-saree</loc></url>'
		].join('')
		expect(finalLocs(xml)).toBe(
			[
				'<url><loc>https://demo.shopnx.in/about-us</loc></url>',
				'<url><loc>https://demo.shopnx.in/refund-policy</loc></url>',
				'<url><loc>https://demo.shopnx.in/p/gift-wrap</loc></url>',
				'<url><loc>https://demo.shopnx.in/products/satin-saree</loc></url>'
			].join('')
		)
	})
})
