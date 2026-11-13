import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/svelte'
import { page } from '$app/state'
import CmsPage from '../src/routes/(legal)/_cms-page.svelte'

const meta = (key: string) => document.head.querySelector(`meta[name="${key}"]`)?.getAttribute('content') ?? null

describe('the CMS policy page shell', () => {
	afterEach(() => {
		cleanup()
		document.head.innerHTML = ''
	})

	it('keeps one h1, and describes the page by its own opening words', () => {
		page.url = new URL('https://demo.shopnx.in/terms-and-conditions') as typeof page.url
		page.data = { store: { name: 'Demo' } }
		const { container } = render(CmsPage, {
			props: {
				title: 'Terms & conditions',
				content: '<article>\n  <h1>Terms and Conditions</h1><p>These terms cover orders &amp; returns on this demo store.</p><h1>Contact</h1></article>'
			}
		})
		expect([...container.querySelectorAll('h1')].map((h) => h.textContent)).toEqual(['Terms & conditions'])
		expect([...container.querySelectorAll('h2')].map((h) => h.textContent)).toEqual(['Contact'])
		expect(document.title).toBe('Terms & conditions | Demo')
		expect(meta('description')).toBe('These terms cover orders & returns on this demo store. Contact')
	})

	it("uses the merchant's own SEO fields when the page has them", () => {
		page.url = new URL('https://demo.shopnx.in/privacy-policy') as typeof page.url
		page.data = { store: { name: 'Demo' } }
		render(CmsPage, {
			props: { title: 'Privacy policy', content: '<p>Text.</p>', meta: { metaTitle: 'Privacy at Demo', metaDescription: 'What we collect and why.' } }
		})
		expect(document.title).toBe('Privacy at Demo')
		expect(meta('description')).toBe('What we collect and why.')
	})
})
