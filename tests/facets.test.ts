import { describe, expect, it, vi } from 'vitest'
import { facetKeys, hasFacetValues, readAppliedFilters } from '$lib/components/product-catalogue/scope-filters.js'

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

describe('facetKeys', () => {
	it('counts the groups under allFilters, so a product type filter reads as applied', () => {
		const facets = { priceStat: {}, categories: [], tags: [], allFilters: { product_type: { Apparel: 3 }, vendor: { Acme: 1 } } }
		expect(facetKeys(facets)).toEqual(['priceStat', 'categories', 'tags', 'allFilters', 'product_type', 'vendor'])
		const applied = readAppliedFilters(new URL('https://shop.test/products?product_type=Apparel&sort=price'), facetKeys(facets))
		expect(applied).toEqual([{ key: 'product_type', value: 'Apparel', label: 'Apparel' }])
		expect(facetKeys(null)).toEqual([])
	})
})
