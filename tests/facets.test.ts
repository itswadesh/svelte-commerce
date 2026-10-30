import { describe, expect, it, vi } from 'vitest'
import { hasFacetValues } from '$lib/components/product-catalogue/scope-filters.js'

vi.mock('$lib/core/composables/index.js', () => ({}))

describe('hasFacetValues', () => {
	it('is false for the empty facets a backend without counts sends', () => {
		expect(hasFacetValues({ priceStat: {}, categories: [], tags: [], allFilters: {} })).toBe(false)
		expect(hasFacetValues({ allFilters: { color: {} }, priceStat: { min: 10, max: 10 } })).toBe(false)
		expect(hasFacetValues(undefined)).toBe(false)
	})

	it('is true when any group has something to pick', () => {
		expect(hasFacetValues({ tags: [{ name: 'new' }] })).toBe(true)
		expect(hasFacetValues({ categories: [{ name: 'Rings' }] })).toBe(true)
		expect(hasFacetValues({ allFilters: { color: { red: 3 } } })).toBe(true)
		expect(hasFacetValues({ priceStat: { min: 5, max: 90 } })).toBe(true)
	})
})
