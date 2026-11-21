import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import { createRawSnippet } from 'svelte'
import { fetchTemplate, previewParams, rememberPreview, templateLayout, TEMPLATE_CORE, withCore } from '$lib/composer/page-layout'
import PageComposer from '$lib/composer/PageComposer.svelte'

// The product grid draws the app's product card, which needs SvelteKit's runtime; not under test here.
vi.mock('$lib/composer/sections/ProductGrid.svelte', () => ({ default: () => {} }))

const core = { id: 'product', type: 'main-product', settings: {} }
const text = (id: string, body: string) => ({ id, type: 'rich-text', settings: { body } })

describe('product and collection templates', () => {
	it('names the core each template is drawn around', () => {
		expect(TEMPLATE_CORE).toEqual({ product: 'main-product', collection: 'main-collection' })
	})

	it('draws a template only around its core: one without it would be a product page without its product', () => {
		const layout = { page: 'product', preview: false, sections: [text('a', 'Above'), core] }
		expect(templateLayout(layout, 'product')).toBe(layout)
		expect(templateLayout({ page: 'product', sections: [text('a', 'Above')] }, 'product')).toBeNull()
		expect(templateLayout({ page: 'collection', sections: [core] }, 'collection')).toBeNull()
		expect(templateLayout(null, 'product')).toBeNull()
		expect(templateLayout({ page: 'product', sections: null } as never, 'product')).toBeNull()
	})

	it('reads the template through the connector, and is null on an older connector or any failure', async () => {
		const getProductLayout = vi.fn(async () => ({ page: 'product', sections: [core] }))
		const getCollectionLayout = vi.fn(async () => {
			throw new Error('down')
		})
		const services = { layoutService: { getProductLayout, getCollectionLayout } }
		expect(await fetchTemplate(services, 'product', null)).toEqual({ page: 'product', sections: [core] })
		expect(getProductLayout).toHaveBeenLastCalledWith({})
		await fetchTemplate(services, 'product', 'k3y')
		expect(getProductLayout).toHaveBeenLastCalledWith({ preview: 'k3y' })
		expect(await fetchTemplate(services, 'collection', null)).toBeNull()
		expect(await fetchTemplate({ layoutService: { getHomeLayout: async () => null } }, 'product', null)).toBeNull()
		expect(await fetchTemplate({}, 'product', null)).toBeNull()
	})

	it('keeps a preview for the tab once the address loses its key, and only in the browser', () => {
		const store = new Map<string, string>()
		const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) }
		const url = (q: string) => new URL('http://shop.test/products/mug' + q)
		expect(previewParams('product', url('?preview=k1&editor=http://admin.test'), true, storage)).toEqual({ preview: 'k1', editor: 'http://admin.test' })
		// The product page swaps its query for ?variant_id=… as it opens; nothing remembered yet.
		expect(previewParams('product', url('?variant_id=3'), true, storage)).toEqual({ preview: null, editor: null })
		rememberPreview('product', 'k1', 'http://admin.test', storage)
		expect(previewParams('product', url('?variant_id=3'), true, storage)).toEqual({ preview: 'k1', editor: 'http://admin.test' })
		expect(previewParams('collection', url(''), true, storage)).toEqual({ preview: null, editor: null })
		// The server has no tab: a shopper's request with no key never gets one.
		expect(previewParams('product', url('?variant_id=3'), false, storage)).toEqual({ preview: null, editor: null })
		// A storage that refuses (a private window, blocked site data) costs the preview, not the page.
		const refusing = {
			getItem: () => {
				throw new Error('no')
			},
			setItem: () => {
				throw new Error('no')
			}
		}
		expect(() => rememberPreview('product', 'k', null, refusing)).not.toThrow()
		expect(previewParams('product', url(''), true, refusing)).toEqual({ preview: null, editor: null })
	})

	it('keeps the published sections when a posted draft has lost its core', () => {
		const published = [text('a', 'Above'), core]
		expect(withCore([text('b', 'Only')], published, 'main-product')).toBe(published)
		const draft = [core, text('b', 'Below')]
		expect(withCore(draft, published, 'main-product')).toBe(draft)
		expect(withCore([text('b', 'Home')], [], null)).toEqual([text('b', 'Home')])
	})
})

describe('PageComposer', () => {
	const coreSnippet = createRawSnippet(() => ({ render: () => '<div data-testid="core">The product</div>' }))

	it('draws the core the page gives it at the place the shop put it, among the sections', () => {
		const { container, getByTestId } = render(PageComposer, {
			layout: { page: 'product', sections: [text('a', 'Above it'), core, text('b', 'Below it')] },
			page: 'product',
			parts: { 'main-product': coreSnippet }
		})
		const html = container.innerHTML
		expect(getByTestId('core')).toBeTruthy()
		expect(html.indexOf('Above it')).toBeLessThan(html.indexOf('The product'))
		expect(html.indexOf('The product')).toBeLessThan(html.indexOf('Below it'))
	})

	it('leaves the page heading to the core on a template: no h1 of its own, every section heading an h2', () => {
		const { container } = render(PageComposer, {
			layout: { page: 'product', sections: [{ id: 'h', type: 'hero', settings: { heading: 'Made by hand' } }, core] },
			page: 'product',
			brandName: 'Shop',
			parts: { 'main-product': coreSnippet }
		})
		expect(container.querySelector('h1')).toBeNull()
		expect(container.querySelector('h2')?.textContent).toContain('Made by hand')
	})

	it('skips a page-specific type the page did not give a part for, rather than failing', () => {
		const { container } = render(PageComposer, {
			layout: { page: 'product', sections: [core, { id: 'r', type: 'product-reviews', settings: {} }, text('b', 'Still here')] },
			page: 'product',
			parts: { 'main-product': coreSnippet }
		})
		expect(container.innerHTML).toContain('Still here')
	})
})
