import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import { headerSize, imageShape, safeShape } from '$lib/composer/image-shape'
import { withBanners } from '$lib/composer/banner-sections'
import Slideshow from '$lib/composer/sections/Slideshow.svelte'

// A JPEG cut off after its frame header: start, an APP0 segment, then SOF0 for 1599 × 842.
const jpeg = new Uint8Array([
	0xff, 0xd8, 0xff, 0xe0, 0x00, 0x04, 0x00, 0x00, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x03, 0x4a, 0x06, 0x3f, 0x03, 0x01, 0x22
])
// A PNG header for 720 × 380.
const png = new Uint8Array(24)
png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, 0, 0, 0x02, 0xd0, 0, 0, 0x01, 0x7c])

describe('banner shape', () => {
	it('reads the size from a JPEG or PNG header', () => {
		expect(headerSize(jpeg)).toEqual([1599, 842])
		expect(headerSize(png)).toEqual([720, 380])
		expect(headerSize(jpeg.slice(0, 10))).toBeNull()
	})

	it('reads a picture over the network, and gives up quietly', async () => {
		const ok = (async () => new Response(jpeg)) as unknown as typeof fetch
		const missing = (async () => new Response('', { status: 404 })) as unknown as typeof fetch
		expect(await imageShape('/a.jpg', ok)).toBe('1599 / 842')
		expect(await imageShape('/a.jpg', missing)).toBe('')
		expect(await imageShape('', ok)).toBe('')
	})

	it('lets only a plain ratio through as CSS', () => {
		expect(safeShape('16 / 9')).toBe('16 / 9')
		expect(safeShape('1; background: red')).toBe('')
	})

	it('gives the banner slideshow its picture shape, phone and wide', () => {
		// jsdom has no matchMedia with listeners; the slideshow asks whether motion is reduced.
		globalThis.matchMedia = ((media: string) => ({
			matches: false,
			media,
			addEventListener: () => {},
			removeEventListener: () => {}
		})) as unknown as typeof matchMedia
		const layout = withBanners(
			{ page: 'home', sections: [{ id: 'a', type: 'rich-text', settings: {} }] },
			{ desktopBanners: [{ url: '/w.jpg' }], mobileBanners: [{ url: '/p.jpg' }] },
			{ wide: '1599 / 842', phone: '720 / 380' }
		)
		const { container } = render(Slideshow, { section: layout!.sections[0] })
		const el = container.querySelector('.cmp-slides') as HTMLElement
		expect(el.style.getPropertyValue('--slide-shape')).toBe('1599 / 842')
		expect(el.style.getPropertyValue('--slide-shape-phone')).toBe('720 / 380')
	})
})
