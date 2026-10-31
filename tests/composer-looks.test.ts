import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { sectionDivider } from '$lib/composer/helpers'
import PageComposer from '$lib/composer/PageComposer.svelte'
import Benefits from '$lib/composer/sections/Benefits.svelte'

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

describe('the scrolling benefits strip', () => {
	const items = [
		{ title: 'Packed by hand', body: 'In our own workshop', icon: 'package' },
		{ title: 'Cash on delivery', icon: 'cash' }
	]

	it('runs a hidden second copy of the list for the loop, so the promises are read once', () => {
		const { container } = render(Benefits, { section: section('b', 'benefits', { style: 'marquee', items }) })
		const lists = [...container.querySelectorAll('ul')].map((ul) => [ul.getAttribute('aria-hidden'), ul.textContent?.replace(/\s+/g, ' ').trim()])
		expect(lists).toEqual([
			[null, 'Packed by hand In our own workshop Cash on delivery'],
			['true', 'Packed by hand In our own workshop Cash on delivery']
		])
		expect(screen.getAllByRole('listitem').map((li) => li.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
			'Packed by hand In our own workshop',
			'Cash on delivery'
		])
		expect(container.querySelector('.cmp-benefits-band')).toBeNull()
	})

	it('stops and starts on its button', async () => {
		const { container } = render(Benefits, { section: section('b', 'benefits', { style: 'marquee', items }) })
		const strip = container.querySelector('.cmp-marquee')!
		const button = screen.getByRole('button')
		const state = () => [button.getAttribute('aria-label'), classes(strip)]
		expect(state()).toEqual(['Pause the strip', 'cmp-marquee'])
		await fireEvent.click(button)
		expect(state()).toEqual(['Play the strip', 'cmp-marquee cmp-marquee--paused'])
		await fireEvent.click(button)
		expect(state()).toEqual(['Pause the strip', 'cmp-marquee cmp-marquee--playing'])
	})

	it('moves at about 30px a second, so long promises take longer to pass than short ones', () => {
		const long = Array.from({ length: 6 }, () => ({ title: 'T'.repeat(80), body: 'B'.repeat(200) }))
		const duration = (list: unknown[]) => {
			const { container, unmount } = render(Benefits, { section: section('b', 'benefits', { style: 'marquee', items: list }) })
			const value = (container.querySelector('.cmp-marquee') as HTMLElement).style.getPropertyValue('--marquee-duration')
			unmount()
			return value
		}
		expect([duration(items), duration(long)]).toEqual(['48s', '255s'])
	})

	it('keeps the band, every promise at once, for a strip with no style or the band', () => {
		for (const style of [undefined, 'band']) {
			const { container, unmount } = render(Benefits, { section: section('b', 'benefits', { style, items }) })
			expect([
				container.querySelectorAll('ul').length,
				!!container.querySelector('.cmp-benefits-band'),
				!!container.querySelector('.cmp-marquee')
			]).toEqual([1, true, false])
			unmount()
		}
	})
})
