import { describe, expect, it } from 'vitest'
import { popularSearches, topCategories } from '../src/lib/components/product-catalogue/no-results'

describe('the categories a search with no results offers', () => {
	it('lists the menu’s top level as links, once each', () => {
		const tree = [
			{ name: 'Women', slug: 'women', children: [{ name: 'Dresses', slug: 'dresses' }] },
			{ name: 'Men', link: '/men' },
			{ name: 'Men again', link: '/men' },
			{ name: '', slug: 'blank' }
		]
		expect(topCategories(tree)).toEqual([
			{ name: 'Women', href: '/women' },
			{ name: 'Men', href: '/men' }
		])
	})

	it('offers nothing without a menu', () => {
		expect(topCategories(undefined)).toEqual([])
		expect(topCategories({})).toEqual([])
	})
})

describe('the popular searches it offers', () => {
	it('reads the backend’s rows, whatever they call the term', () => {
		expect(popularSearches({ data: [{ text: 'kurta' }, { q: 'Saree' }, 'dress', { name: 'KURTA' }] }).map((l) => l.name)).toEqual([
			'kurta',
			'Saree',
			'dress'
		])
		expect(popularSearches(['red dress'])[0].href).toBe('/products?search=red%20dress')
	})

	it('is empty when the backend keeps no such list', () => {
		expect(popularSearches({ data: [], count: 0 })).toEqual([])
		expect(popularSearches(null)).toEqual([])
	})
})
