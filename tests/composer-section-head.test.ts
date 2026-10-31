import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { themeTokenCss, themeTokenDeclarations } from '$lib/composer/theme-tokens'
import ProductGrid from '$lib/composer/sections/ProductGrid.svelte'
import CollectionList from '$lib/composer/sections/CollectionList.svelte'
import MultiColumn from '$lib/composer/sections/MultiColumn.svelte'
import Faq from '$lib/composer/sections/Faq.svelte'
import Benefits from '$lib/composer/sections/Benefits.svelte'
import RichText from '$lib/composer/sections/RichText.svelte'

// The card needs SvelteKit's runtime.
vi.mock('$lib/components/product-catalogue/product-card.svelte', () => ({ default: () => {} }))

const section = (type: string, settings: Record<string, unknown>, extra: Record<string, unknown> = {}) => ({ id: 's1', type, settings, ...extra })
const products = [{ id: 'p1', slug: 'mug', title: 'Mug' }]
const collections = [{ id: '1', title: 'Gifts', link: '/collections/gifts', image: null }]

function head(container: HTMLElement) {
	const header = container.querySelector('header.cmp-head')!
	return {
		eyebrow: header.querySelector('.cmp-head__eyebrow')?.textContent ?? null,
		title: header.querySelector('h2')?.textContent ?? null,
		subtitle: header.querySelector('.cmp-head__subtitle')?.textContent ?? null,
		link: header.querySelector('a') ? [header.querySelector('a')!.textContent!.trim(), header.querySelector('a')!.getAttribute('href')] : null
	}
}

describe('eyebrow_case', () => {
	it('draws the small line in spaced capitals only when the store chose upper', () => {
		expect(themeTokenDeclarations({ eyebrow_case: 'upper' })).toEqual({ '--eyebrow-case': 'uppercase', '--eyebrow-tracking': '0.14em' })
		expect(themeTokenCss({ eyebrow_case: 'upper' })).toBe('[data-theme][data-theme] { --eyebrow-case: uppercase !important; --eyebrow-tracking: 0.14em !important; }')
	})

	it('leaves the line as typed when unset, sentence, or anything else', () => {
		expect(themeTokenDeclarations({ eyebrow_case: 'sentence' })).toEqual({})
		expect(themeTokenDeclarations({ eyebrow_case: 'UPPER' })).toEqual({})
		expect(themeTokenDeclarations({ eyebrow_case: 'uppercase; color: red' })).toEqual({})
		expect(themeTokenCss({ eyebrow_case: 'sentence' })).toBe('')
	})
})

describe('a section heading with its words', () => {
	it('puts the small line above the product grid heading, the line under it, and the link beside', () => {
		const { container } = render(ProductGrid, {
			section: section(
				'product-grid',
				{ eyebrow: 'Most loved', heading: 'Best selling', subtitle: 'The ones people come back for.', view_all_text: 'Shop all', view_all_link: '/collections/best' },
				{ products }
			)
		})
		expect(head(container)).toEqual({
			eyebrow: 'Most loved',
			title: 'Best selling',
			subtitle: 'The ones people come back for.',
			link: ['Shop all', '/collections/best']
		})
		expect(container.querySelector('.cmp-head__words')!.children[1].tagName).toBe('H2')
	})

	it('says "View all" when the link has no text of its own, and draws no link that is not safe', () => {
		const { container } = render(CollectionList, {
			section: section('collection-list', { heading: 'Our sets', view_all_link: '/collections' }, { collections })
		})
		expect(head(container).link).toEqual(['View all: Our sets', '/collections'])

		const unsafe = render(MultiColumn, {
			section: section('multi-column', { heading: 'Start', view_all_text: 'All', view_all_link: 'javascript:alert(1)', items: [{ heading: 'Shop', link: '/products' }] })
		})
		expect(head(unsafe.container).link).toBeNull()
	})

	it('draws the heading straight under the header when there is no small line or line under it', () => {
		const { container } = render(Faq, { section: section('faq', { heading: 'Questions', items: [{ question: 'Q', answer: 'A' }] }) })
		expect(container.querySelector('header.cmp-head')!.innerHTML.replace(/<!--[\s\S]*?-->/g, '')).toBe('<h2 class="cmp-head__title">Questions</h2>')
	})

	it('keeps a header for the small line alone, and the benefits band its own heading style', () => {
		const faq = render(Faq, { section: section('faq', { eyebrow: 'Help', items: [{ question: 'Q', answer: 'A' }] }) })
		expect(head(faq.container)).toEqual({ eyebrow: 'Help', title: null, subtitle: null, link: null })

		const band = render(Benefits, { section: section('benefits', { eyebrow: 'Our promise', heading: 'Why us', subtitle: 'Every order.', items: [{ title: 'Fast' }] }) })
		expect(head(band.container)).toEqual({ eyebrow: 'Our promise', title: 'Why us', subtitle: 'Every order.', link: null })
		expect(band.container.querySelector('h2')!.classList.contains('cmp-benefits__heading')).toBe(true)
		expect(screen.getByRole('heading', { level: 3, name: 'Fast' })).toBeInTheDocument()
	})

	it('puts the small line above the heading of a text section', () => {
		const { container } = render(RichText, { section: section('rich-text', { eyebrow: 'The whole range', heading: 'Everything', body: 'One page.' }) })
		const rich = container.querySelector('.cmp-rich')!
		expect([...rich.children].map((el) => el.textContent)).toEqual(['The whole range', 'Everything', 'One page.'])
	})
})
