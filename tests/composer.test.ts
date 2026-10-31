import { describe, it, expect, vi } from 'vitest'
import {
	benefitItems,
	firstPictureSection,
	gridColumnsClass,
	intSetting,
	knownSections,
	pageHeadingSection,
	paragraphs,
	safeHref,
	text,
	type ComposerSection
} from '$lib/composer/helpers'

const section = (id: string, type: string, settings: Record<string, unknown> = {}): ComposerSection => ({ id, type, settings })

describe('paragraphs', () => {
	it('starts a new paragraph at each blank line and keeps single breaks inside one', () => {
		expect(paragraphs('One\nstill one\n\nTwo\r\n\r\nThree')).toEqual(['One\nstill one', 'Two', 'Three'])
	})

	it('treats a line of spaces as blank and drops empty paragraphs', () => {
		expect(paragraphs('  A  \n   \n\n\nB\n\n')).toEqual(['A', 'B'])
	})

	it('answers nothing for anything that is not text', () => {
		expect(paragraphs(undefined)).toEqual([])
		expect(paragraphs(42)).toEqual([])
		expect(paragraphs('   ')).toEqual([])
	})

	it('never interprets markup: it stays text for the template to escape', () => {
		expect(paragraphs('<b>bold</b>')).toEqual(['<b>bold</b>'])
	})
})

describe('knownSections', () => {
	const registry = { hero: {}, 'rich-text': {} }

	it('keeps known sections in order and skips an unknown type with a warning', () => {
		const warn = vi.fn()
		const out = knownSections([section('a', 'hero'), section('b', 'video-wall'), section('c', 'rich-text'), section('d', 'hero')], registry, warn)
		expect(out.map((s) => s.id)).toEqual(['a', 'c', 'd'])
		expect(warn).toHaveBeenCalledOnce()
		expect(warn.mock.calls[0][0]).toContain('video-wall')
	})

	it('does not mistake an inherited property for a section type', () => {
		expect(knownSections([section('a', 'toString'), section('b', '__proto__')], registry)).toEqual([])
	})

	it('copes with no sections at all', () => {
		expect(knownSections(undefined, registry)).toEqual([])
		expect(knownSections(null, registry)).toEqual([])
	})
})

describe('safeHref', () => {
	it('allows a path on this site and an http(s) address', () => {
		expect(safeHref('/collections/new')).toBe('/collections/new')
		expect(safeHref(' https://example.com/a?b=1 ')).toBe('https://example.com/a?b=1')
		expect(safeHref('http://example.com')).toBe('http://example.com')
	})

	it('refuses scripts, protocol-relative and anything that is not a string', () => {
		expect(safeHref('javascript:alert(1)')).toBe('')
		expect(safeHref('//evil.example')).toBe('')
		expect(safeHref('/\\evil.example')).toBe('')
		expect(safeHref('/\t/evil.example')).toBe('')
		expect(safeHref('/shop\\..\\evil')).toBe('')
		expect(safeHref('data:text/html,hi')).toBe('')
		expect(safeHref(null)).toBe('')
		expect(safeHref(['/a'])).toBe('')
	})
})

describe('settings', () => {
	it('reads text trimmed, and nothing for a value of the wrong shape', () => {
		expect(text({ heading: '  New in  ' }, 'heading')).toBe('New in')
		expect(text({ heading: 5 }, 'heading')).toBe('')
		expect(text(undefined, 'heading')).toBe('')
	})

	it('clamps numbers to their range', () => {
		expect(intSetting(30, 1, 24, 8)).toBe(24)
		expect(intSetting('3', 1, 24, 8)).toBe(3)
		expect(intSetting('many', 1, 24, 8)).toBe(8)
	})

	it('gives two columns on phones and the chosen count on a computer', () => {
		expect(gridColumnsClass(2)).toBe('grid-cols-2')
		expect(gridColumnsClass(3)).toBe('grid-cols-2 md:grid-cols-3')
		expect(gridColumnsClass(4)).toBe('grid-cols-2 md:grid-cols-3 lg:grid-cols-4')
		expect(gridColumnsClass(undefined)).toBe('grid-cols-2 md:grid-cols-3 lg:grid-cols-4')
		expect(gridColumnsClass(9)).toBe('grid-cols-2 md:grid-cols-3 lg:grid-cols-4')
	})

	it('keeps benefits with a title, at most six', () => {
		const items = Array.from({ length: 8 }, (_, i) => ({ title: `T${i}`, body: 'b' }))
		expect(benefitItems(items)).toHaveLength(6)
		expect(benefitItems([{ title: '' }, { title: 'Kept', body: 7 }, 'junk'])).toEqual([{ title: 'Kept', body: '', icon: '' }])
		expect(benefitItems(undefined)).toEqual([])
	})
})

describe('pageHeadingSection', () => {
	it('makes the first hero with a heading the page heading', () => {
		const sections = [
			section('bar', 'announcement-bar', { text: 'Hi' }),
			section('h0', 'hero', {}),
			section('h1', 'hero', { heading: 'Welcome' }),
			section('h2', 'hero', { heading: 'Again' })
		]
		expect(pageHeadingSection(sections)).toBe('h1')
	})

	it('answers null when no hero can carry it', () => {
		expect(pageHeadingSection([section('r', 'rich-text', { heading: 'About' })])).toBeNull()
	})
})

describe('firstPictureSection', () => {
	it('skips a hero without a picture and picks the product grid below it', () => {
		const grid = { ...section('g', 'product-grid', {}), products: [{ id: 1 }] } as ComposerSection
		expect(firstPictureSection([section('h', 'hero', { heading: 'Hi' }), grid])).toBe(1)
	})

	it('picks a hero that has a picture', () => {
		expect(firstPictureSection([section('h', 'hero', { heading: 'Hi', image: 'https://x.test/a.jpg' })])).toBe(0)
	})

	it('answers -1 for an empty grid or a picture below the first three sections', () => {
		const text4 = [0, 1, 2].map((i) => section(`r${i}`, 'rich-text', {}))
		const grid = { ...section('g', 'product-grid', {}), products: [{ id: 1 }] } as ComposerSection
		expect(firstPictureSection([section('g0', 'product-grid', {})])).toBe(-1)
		expect(firstPictureSection([...text4, grid])).toBe(-1)
	})
})
