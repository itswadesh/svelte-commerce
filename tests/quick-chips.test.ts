import { describe, expect, it } from 'vitest'
import { NEWEST_SORT, newestHref, phoneChips } from '../src/lib/components/product-catalogue/quick-chips'

const groups = [
	{ id: 'categories', label: 'categories' },
	{ id: 'options.Colour', label: 'options.Colour' },
	{ id: 'options.Size', label: 'options.Size' }
]

describe('the phone’s quick filter chips', () => {
	it('offers Size, Colour and New where the listing has them', () => {
		expect(phoneChips(groups, 12)).toEqual([
			{ kind: 'group', id: 'options.Size', name: 'Size' },
			{ kind: 'group', id: 'options.Colour', name: 'Colour' },
			{ kind: 'new' }
		])
	})

	it('hides a chip the listing cannot filter by', () => {
		expect(phoneChips([{ id: 'categories', label: 'categories' }], 12)).toEqual([{ kind: 'new' }])
		expect(phoneChips([{ id: 'attributes.color', label: 'Color' }], 12).map((c) => c.kind === 'group' && c.name)).toEqual(['Colour', false])
	})

	it('has nothing to sort with one product or none', () => {
		expect(phoneChips(groups, 1).some((c) => c.kind === 'new')).toBe(false)
		expect(phoneChips([], 0)).toEqual([])
	})
})

describe('the New chip', () => {
	it('sorts newest first and drops the page, keeping filters', () => {
		expect(newestHref(new URL('https://s.test/women?page=3&options.Size=M'))).toBe(`/women?options.Size=M&sort=${encodeURIComponent(NEWEST_SORT)}`)
	})

	it('goes back to the default order when pressed again', () => {
		expect(newestHref(new URL(`https://s.test/women?sort=${NEWEST_SORT}&options.Size=M`))).toBe('/women?options.Size=M')
	})
})
