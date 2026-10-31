import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import { sectionDivider } from '$lib/composer/helpers'
import PageComposer from '$lib/composer/PageComposer.svelte'

vi.mock('$lib/components/product-catalogue/product-card.svelte', () => ({ default: () => {} }))

const section = (id: string, type: string, settings: Record<string, unknown>) => ({ id, type, settings })
const classes = (el: Element) => el.className.replace(/\s*svelte-\w+/g, '')

describe('a section set apart from the one above', () => {
	it('reads a line or a band, and nothing else', () => {
		expect(sectionDivider({ divider: 'line' })).toBe('line')
		expect(sectionDivider({ divider: ' band ' })).toBe('band')
		expect(sectionDivider({ divider: 'none' })).toBe('')
		expect(sectionDivider({ divider: 'dots' })).toBe('')
		expect(sectionDivider({})).toBe('')
		expect(sectionDivider(null)).toBe('')
	})

	it('wraps only a section with a line or a band, and leaves every other section as it was', () => {
		const { container } = render(PageComposer, {
			layout: {
				page: 'home',
				sections: [
					section('a', 'rich-text', { heading: 'Plain' }),
					section('b', 'rich-text', { heading: 'Lined', divider: 'line' }),
					section('c', 'rich-text', { heading: 'Banded', divider: 'band' }),
					section('d', 'rich-text', { heading: 'None', divider: 'none' })
				]
			}
		})
		const children = [...container.querySelector('.cmp-home')!.children].map((el) => [el.tagName, classes(el), el.textContent?.trim()])
		expect(children).toEqual([
			['SECTION', 'cmp-band', 'Plain'],
			['DIV', 'cmp-divider--line', 'Lined'],
			['DIV', 'cmp-divider--band', 'Banded'],
			['SECTION', 'cmp-band', 'None']
		])
	})
})
