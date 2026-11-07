import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import { flushSync } from 'svelte'
import {
	bentoSizes,
	bentoTiles,
	choice,
	countdownEnd,
	countdownParts,
	firstPictureSection,
	logoItems,
	pageHeadingSection,
	phraseItems,
	quoteItems,
	scrollSeconds,
	statItems
} from '$lib/composer/helpers'
import { SECTIONS } from '$lib/composer/registry'
import BentoGrid from '$lib/composer/sections/BentoGrid.svelte'
import Countdown from '$lib/composer/sections/Countdown.svelte'
import LogoCloud from '$lib/composer/sections/LogoCloud.svelte'
import ProductGrid from '$lib/composer/sections/ProductGrid.svelte'
import ScrollingText from '$lib/composer/sections/ScrollingText.svelte'
import Spotlight from '$lib/composer/sections/Spotlight.svelte'
import Stats from '$lib/composer/sections/Stats.svelte'
import Testimonials from '$lib/composer/sections/Testimonials.svelte'

vi.mock('$lib/components/product-catalogue/product-card.svelte', () => ({ default: () => {} }))

const section = (type: string, settings: Record<string, unknown>, extra: Record<string, unknown> = {}) => ({ id: 's1', type, settings, ...extra })

describe('the section registry', () => {
	it('draws each new type the engine offers', () => {
		for (const type of ['spotlight', 'bento-grid', 'testimonials', 'stats', 'logo-cloud', 'scrolling-text', 'countdown']) {
			expect(SECTIONS[type], type).toBeTruthy()
		}
	})
})

describe('a section added and not yet filled in', () => {
	// The panel saves these empty on purpose, and the preview draws them as they are typed.
	it.each([
		['spotlight', Spotlight],
		['bento-grid', BentoGrid],
		['testimonials', Testimonials],
		['stats', Stats],
		['logo-cloud', LogoCloud],
		['scrolling-text', ScrollingText],
		['countdown', Countdown]
	])('%s draws nothing, not an empty box', (type, Component) => {
		const { container } = render(Component as any, { section: section(type, {}) })
		expect(container.querySelector('section')).toBeNull()
	})

	it.each([
		['bento-grid', BentoGrid, { items: [{}] }],
		['testimonials', Testimonials, { items: [{ name: 'A name and no words' }] }],
		['stats', Stats, { items: [{ value: '12' }] }],
		['logo-cloud', LogoCloud, { items: [{ name: 'No picture' }] }],
		['scrolling-text', ScrollingText, { items: [{}] }]
	])('%s ignores an item that has nothing to show yet', (type, Component, settings) => {
		const { container } = render(Component as any, { section: section(type, settings) })
		expect(container.querySelector('section')).toBeNull()
	})
})

describe('reading settings defensively', () => {
	it('takes a choice, or the fallback for anything else', () => {
		expect(choice(' tall ', ['medium', 'tall'], 'medium')).toBe('tall')
		expect(choice('giant', ['medium', 'tall'], 'medium')).toBe('medium')
		expect(choice(7, ['medium', 'tall'], 'medium')).toBe('medium')
	})

	it('does not throw on a list of the wrong shape', () => {
		for (const read of [bentoTiles, quoteItems, statItems, logoItems, phraseItems]) {
			expect(read('nope')).toEqual([])
			expect(read(null)).toEqual([])
			expect(read([null, 3])).toEqual([])
		}
	})

	it('never carries an unsafe address to a link or a picture', () => {
		expect(bentoTiles([{ heading: 'A', image: 'javascript:alert(1)', link: '//evil.example' }])[0]).toMatchObject({ image: '', link: '' })
		expect(logoItems([{ image: 'javascript:alert(1)' }])).toEqual([])
		expect(quoteItems([{ quote: 'Lovely', image: 'data:text/html,x' }])[0].image).toBe('')
	})

	it('reads a rating as whole stars, none when it is unset', () => {
		expect(quoteItems([{ quote: 'q' }])[0].rating).toBe(0)
		expect(quoteItems([{ quote: 'q', rating: 4 }])[0].rating).toBe(4)
		expect(quoteItems([{ quote: 'q', rating: 40 }])[0].rating).toBe(5)
	})

	it('holds a figure to having both a value and what it counts', () => {
		expect(statItems([{ value: '12', label: 'Years' }, { value: '40k' }, { label: 'Cities' }])).toEqual([{ value: '12', label: 'Years' }])
	})
})

describe('the bento grid', () => {
	// A row left short is a visible hole in a section whose whole look is its fit.
	it.each(['feature', 'mosaic'])('%s fills four columns exactly at every count', (layout) => {
		for (let count = 1; count <= 6; count++) {
			const area = bentoSizes(count, layout).reduce((sum, size) => sum + size.w * size.h, 0)
			expect(area % 4, `${count} tiles`).toBe(0)
			expect(bentoSizes(count, layout)).toHaveLength(count)
		}
	})

	it('leaves no tile alone on a row of a phone', () => {
		for (let count = 1; count <= 6; count++) {
			const cells = bentoSizes(count, 'feature').reduce((sum, size) => sum + (size.widePhone ? 2 : 1), 0)
			expect(cells % 2, `${count} tiles`).toBe(0)
		}
		expect(bentoSizes(0, 'feature')).toEqual([])
	})

	it('makes a linked tile one target, named by its heading', () => {
		const { container } = render(BentoGrid, {
			section: section('bento-grid', { heading: 'Shop by mood', items: [{ heading: 'Summer', link: '/collections/summer', link_text: 'See more' }] })
		})
		const links = container.querySelectorAll('a')
		expect(links).toHaveLength(1)
		expect(links[0].textContent).toBe('Summer')
		expect(container.querySelector('h3')).not.toBeNull()
	})

	it('names a tile that is only a picture and a link by what the picture shows', () => {
		const { container } = render(BentoGrid, {
			section: section('bento-grid', { items: [{ image: '/a.webp', image_alt: 'A red kurta', link: '/k' }] })
		})
		expect(container.querySelector('a')!.getAttribute('aria-label')).toBe('A red kurta')
	})
})

describe('the spotlight banner', () => {
	it('carries the page heading the way a hero does, and takes the first picture priority', () => {
		const spot = section('spotlight', { heading: 'Summer', image: '/s.webp' })
		expect(pageHeadingSection([spot as any])).toBe('s1')
		expect(firstPictureSection([spot as any])).toBe(0)
		const { container } = render(Spotlight, { section: spot, isPageHeading: true, priority: true })
		expect(container.querySelector('h1')!.textContent).toBe('Summer')
		expect(container.querySelector('img')!.getAttribute('loading')).toBe('eager')
	})

	it('is an h2 further down the page, and says what the picture shows', () => {
		const { container } = render(Spotlight, { section: section('spotlight', { heading: 'Summer', image: '/s.webp', image_alt: 'A beach' }) })
		expect(container.querySelector('h1')).toBeNull()
		expect(container.querySelector('h2')).not.toBeNull()
		expect(container.querySelector('img')!.getAttribute('alt')).toBe('A beach')
	})

	it('falls back to a safe look for a setting it does not know', () => {
		const { container } = render(Spotlight, { section: section('spotlight', { heading: 'H', height: '"><script>', position: 'nowhere' }) })
		expect(container.querySelector('section')!.className).toContain('cmp-spot--tall')
		expect(container.querySelector('section')!.className).toContain('cmp-spot--bottom-left')
	})
})

describe('customer quotes', () => {
	const items = [
		{ quote: 'First', name: 'Asha', rating: 5 },
		{ quote: 'Second', name: 'Ravi' }
	]

	it('draws the words, the person and the stars the shop entered, and no others', () => {
		const { container } = render(Testimonials, { section: section('testimonials', { items }) })
		expect(container.querySelectorAll('blockquote')).toHaveLength(2)
		expect(container.querySelector('[role="img"]')!.getAttribute('aria-label')).toBe('5 out of 5 stars')
		expect(container.querySelectorAll('[role="img"]')).toHaveLength(1)
	})

	it('draws the first large in the feature style, without repeating it', () => {
		const { container } = render(Testimonials, { section: section('testimonials', { style: 'feature', items }) })
		expect(container.querySelector('.cmp-quote-large blockquote')!.textContent).toBe('First')
		expect(container.querySelectorAll('.cmp-quotes-stack blockquote')).toHaveLength(1)
	})

	it('gives a single quote the large look, with nothing to swipe to', () => {
		const { container } = render(Testimonials, { section: section('testimonials', { style: 'row', items: [items[0]] }) })
		expect(container.querySelector('.cmp-quote-large')).not.toBeNull()
		expect(container.querySelector('.cmp-quotes-row')).toBeNull()
	})
})

describe('moving strips', () => {
	it('hides the second copy of the words from screen readers and offers a pause', () => {
		const { container } = render(ScrollingText, { section: section('scrolling-text', { items: [{ text: 'New in' }] }) })
		const groups = container.querySelectorAll('.cmp-mq__group')
		expect(groups).toHaveLength(2)
		expect(groups[0].getAttribute('aria-hidden')).toBeNull()
		expect(groups[1].getAttribute('aria-hidden')).toBe('true')
		expect(container.querySelector('button')!.getAttribute('aria-label')).toContain('Pause')
	})

	it('keeps the hidden copy of the logos out of the tab order and the reading order', () => {
		const { container } = render(LogoCloud, {
			section: section('logo-cloud', { style: 'scroll', items: [{ image: '/a.svg', name: 'Acme', link: '/acme' }] })
		})
		const [seen, hidden] = container.querySelectorAll('.cmp-mq__group')
		expect(seen.querySelector('img')!.getAttribute('alt')).toBe('Acme')
		expect(seen.querySelector('a')!.getAttribute('tabindex')).toBeNull()
		expect(hidden.querySelector('img')!.getAttribute('alt')).toBe('')
		expect(hidden.querySelector('a')!.getAttribute('tabindex')).toBe('-1')
	})

	it('keeps a pace, and never goes faster than a phrase can be read', () => {
		expect(scrollSeconds(100, 'slow')).toBe(60)
		expect(scrollSeconds(100, 'fast')).toBe(25)
		expect(scrollSeconds(100, 'nonsense')).toBe(60)
		expect(scrollSeconds(3, 'fast')).toBe(16)
	})
})

describe('a logo row', () => {
	it('is grey unless the shop switched that off', () => {
		const items = [{ image: '/a.svg', name: 'Acme' }]
		const on = render(LogoCloud, { section: section('logo-cloud', { items }) })
		expect(on.container.querySelector('.cmp-logos--mono')).not.toBeNull()
		const off = render(LogoCloud, { section: section('logo-cloud', { items, monochrome: false }) })
		expect(off.container.querySelector('.cmp-logos--mono')).toBeNull()
	})
})

describe('the numbers', () => {
	it('reads each figure with what it counts', () => {
		const { container } = render(Stats, { section: section('stats', { items: [{ value: '12', label: 'Years' }] }) })
		expect(container.querySelector('dt')!.textContent).toBe('Years')
		expect(container.querySelector('dd')!.textContent).toBe('12')
	})
})

describe('the countdown', () => {
	const NOW = Date.parse('2026-12-01T00:00:00Z')

	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(NOW)
	})
	afterEach(() => {
		vi.useRealTimers()
	})

	it('reads an end, or nothing for one it cannot', () => {
		expect(countdownEnd('2026-12-01T00:00:00Z')).toBe(NOW)
		expect(countdownEnd('soon')).toBeNull()
		expect(countdownEnd('')).toBeNull()
		expect(countdownEnd(undefined)).toBeNull()
	})

	it('breaks the time left into whole units and stops at zero', () => {
		const end = NOW + (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000
		expect(countdownParts(end, NOW)).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5 })
		expect(countdownParts(NOW - 1000, NOW)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
	})

	it('counts down each second', () => {
		const { container } = render(Countdown, { section: section('countdown', { heading: 'Sale', ends_at: '2026-12-01T00:01:05Z' }) })
		flushSync()
		const digits = () => [...container.querySelectorAll('.cmp-count__digits')].map((d) => d.textContent)
		expect(digits()).toEqual(['00', '00', '01', '05'])
		vi.advanceTimersByTime(1000)
		flushSync()
		expect(digits()).toEqual(['00', '00', '01', '04'])
	})

	it('comes off the page when it ends, by default', () => {
		const { container } = render(Countdown, { section: section('countdown', { heading: 'Sale', ends_at: '2026-12-01T00:00:01Z' }) })
		flushSync()
		expect(container.querySelector('h2')).not.toBeNull()
		vi.advanceTimersByTime(1000)
		flushSync()
		expect(container.querySelector('section')).toBeNull()
	})

	it('says the message once it has ended, when the shop wrote one', () => {
		const { container } = render(Countdown, {
			section: section('countdown', { heading: 'Sale', ends_at: '2026-11-01T00:00:00Z', after_end: 'message', ended_text: 'The sale has ended' })
		})
		flushSync()
		expect(container.textContent).toContain('The sale has ended')
		expect(container.querySelector('[role="timer"]')).toBeNull()
	})

	it('comes off the page when it has ended and the message was left empty', () => {
		const { container } = render(Countdown, { section: section('countdown', { ends_at: '2026-11-01T00:00:00Z', after_end: 'message' }) })
		flushSync()
		expect(container.querySelector('section')).toBeNull()
	})
})

describe('a product grid beside a picture', () => {
	const products = Array.from({ length: 9 }, (_, i) => ({ id: `p${i}`, slug: `p${i}`, title: `P${i}` }))

	it('puts the words on the picture and links them to View all', () => {
		const { container } = render(ProductGrid, {
			section: section('product-grid', { style: 'showcase', image: '/s.webp', heading: 'New in', view_all_link: '/new' }, { products })
		})
		expect(container.querySelector('.cmp-show__picture h2')!.textContent).toBe('New in')
		expect(container.querySelector('.cmp-show__picture a')!.getAttribute('href')).toBe('/new')
		expect(container.querySelector('.cmp-head')).toBeNull()
	})

	it('stays a plain grid without a picture, or in the rows style', () => {
		for (const settings of [{ style: 'showcase', heading: 'H' }, { style: 'grid', image: '/s.webp', heading: 'H' }, { heading: 'H' }]) {
			const { container } = render(ProductGrid, { section: section('product-grid', settings, { products }) })
			expect(container.querySelector('.cmp-show')).toBeNull()
			expect(container.querySelector('.cmp-head h2')!.textContent).toBe('H')
		}
	})

	it('draws nothing with no products, whatever the picture', () => {
		const { container } = render(ProductGrid, { section: section('product-grid', { style: 'showcase', image: '/s.webp' }, { products: [] }) })
		expect(container.querySelector('section')).toBeNull()
	})
})
