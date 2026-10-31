import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { columnItems, columnLook, columnsClass } from '$lib/composer/helpers'
import MultiColumn from '$lib/composer/sections/MultiColumn.svelte'

const section = (type: string, settings: Record<string, unknown>, extra: Record<string, unknown> = {}) => ({ id: 's', type, settings, ...extra })
const classes = (el: Element) => el.className.replace(/\s*svelte-\w+/g, '')
const names = ['Kitchen', 'Home decor', 'Lighting', 'Storage', 'Textiles', 'Garden']
const categories = (n: number) => names.slice(0, n).map((heading, i) => ({ image: `/c${i}.webp`, heading, link: `/categories/c${i}` }))
const html = (component: any, props: Record<string, unknown>) => {
	const { container, unmount } = render(component, props)
	const out = container.innerHTML
	unmount()
	return out
}

describe('captioned columns', () => {
	it('reads captioned only when the store chose it, and otherwise tiles or columns by what the columns hold', () => {
		const links = columnItems(categories(2))
		const text = columnItems([{ heading: 'Made here', text: 'By hand.' }])
		expect([
			columnLook({ style: 'captioned' }, text),
			columnLook({ style: 'tiles' }, links),
			columnLook({}, links),
			columnLook({ style: 'cards' }, text),
			columnLook(null, text)
		]).toEqual(['captioned', 'tiles', 'tiles', 'columns', 'columns'])
	})

	it('sits two across on a phone and keeps a tile size on a computer, five across for five and six for six', () => {
		expect([1, 3, 4, 5, 6, 7].map((n) => columnsClass(n, 'captioned'))).toEqual([
			'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
			'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
			'grid-cols-2 md:grid-cols-4',
			'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
			'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
			'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
		])
	})

	it('draws five square pictures, each named under it by a link that covers the picture, with no arrow', () => {
		const { container } = render(MultiColumn, { section: section('multi-column', { style: 'captioned', heading: 'Shop by category', items: categories(5) }) })
		expect(classes(container.querySelector('ul')!)).toBe('cmp-mc grid gap-x-[var(--grid-gap-x,12px)] gap-y-[var(--grid-gap-y,16px)] grid-cols-2 md:grid-cols-3 lg:grid-cols-5 cmp-mc--captioned')
		expect(
			[...container.querySelectorAll('.cmp-mc__col')].map((li) => [li.querySelector('img')?.getAttribute('src'), li.querySelector('h3 > a')?.textContent, li.querySelector('h3 > a')?.getAttribute('href')])
		).toEqual([
			['/c0.webp', 'Kitchen', '/categories/c0'],
			['/c1.webp', 'Home decor', '/categories/c1'],
			['/c2.webp', 'Lighting', '/categories/c2'],
			['/c3.webp', 'Storage', '/categories/c3'],
			['/c4.webp', 'Textiles', '/categories/c4']
		])
		expect(container.querySelector('svg')).toBeNull()
	})

	it('names a column with no link in plain text, keeps its words, and never draws an unnamed link', () => {
		const { container } = render(MultiColumn, {
			section: section('multi-column', {
				style: 'captioned',
				items: [{ image: '/a.webp', heading: 'Made here', text: 'By hand.' }, { image: '/b.webp', link: '/products' }, { image: '/c.webp', link_text: 'See all', link: '/products' }]
			})
		})
		expect([...container.querySelectorAll('.cmp-mc__col')].map((li) => li.textContent?.replace(/\s+/g, ' ').trim())).toEqual(['Made here By hand.', '', 'See all'])
		expect(screen.getAllByRole('link').map((a) => [a.textContent, a.getAttribute('href')])).toEqual([['See all', '/products']])
		expect(container.querySelector('p.cmp-mc__title')?.textContent?.trim()).toBe('Made here')
	})

	it('keeps a square box where a captioned column has no picture, so its name lines up with the others', () => {
		const items = [...categories(2), { heading: 'Garden', link: '/categories/garden' }]
		const { container } = render(MultiColumn, { section: section('multi-column', { style: 'captioned', items }) })
		expect([...container.querySelectorAll('.cmp-mc__col')].map((li) => [!!li.querySelector('.cmp-mc__media'), !!li.querySelector('img')])).toEqual([
			[true, true],
			[true, true],
			[true, false]
		])
	})

	it('keeps the old classes for one to four tiles or text columns', () => {
		expect([1, 2, 3, 4].map((n) => [columnsClass(n), columnsClass(n, 'tiles')])).toEqual([
			['grid-cols-1', 'grid-cols-1'],
			['grid-cols-1 md:grid-cols-2', 'grid-cols-2'],
			['grid-cols-1 md:grid-cols-3', 'grid-cols-2 md:grid-cols-3'],
			['grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', 'grid-cols-2 lg:grid-cols-4']
		])
	})

	it('draws a section with no style exactly as one with the tiles style, tiles and text columns alike', () => {
		const text = [{ heading: 'Made here', text: 'By hand.' }, { image: '/a.webp', heading: 'Kept long' }]
		for (const items of [categories(4), text]) {
			const settings = { heading: 'Start shopping', items }
			expect(html(MultiColumn, { section: section('multi-column', { ...settings, style: 'tiles' }) })).toBe(html(MultiColumn, { section: section('multi-column', settings) }))
		}
		const { container } = render(MultiColumn, { section: section('multi-column', { heading: 'Start shopping', items: categories(4) }) })
		expect([classes(container.querySelector('ul')!), container.querySelectorAll('svg.cmp-mc__arrow').length]).toEqual(['cmp-mc grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4 cmp-mc--tiles', 4])
	})
})
