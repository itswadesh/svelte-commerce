import { beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from '$app/state'

// The utils barrel pulls in $app/navigation; the real CDN URL builder is all this needs.
vi.mock('@misiki/kitcommerce-core/utils', () => import('../node_modules/@misiki/kitcommerce-core/dist/utils/image-cdn.js'))

const { lazyImgSrcset } = await import('$lib/core/components/image/lazy-img.svelte')

const cdn = { imageCdn: { active: true, provider: 'cloudflare', url: 'https://img.example/images/s1' } }

beforeEach(() => {
	page.data = {}
})

describe('lazyImgSrcset', () => {
	it('offers one rendition per width through the image CDN', () => {
		page.data = { store: { plugins: cdn } }
		const set = lazyImgSrcset('https://shop.example/media/a.webp').split(', ')
		expect(set).toHaveLength(8)
		expect(set[0]).toBe('https://img.example/images/s1/cdn-cgi/image/width=160,quality=80,format=auto/media/a.webp 160w')
	})

	it('is empty when every width would be the same file', () => {
		expect(lazyImgSrcset('https://shop.example/media/a.webp')).toBe('')
		page.data = { store: { plugins: cdn } }
		expect(lazyImgSrcset('/backend/sample-media/2/a.webp')).toBe('')
	})
})
