import { describe, expect, it } from 'vitest'
import { childrenOf } from '$lib/components/product-catalogue/subcategories'

const tree = [
	{
		name: 'Women',
		slug: 'women',
		children: [
			{ name: 'Dresses', slug: 'women-dresses', link: '/women-dresses', thumbnail: '/media/d.webp', children: [] },
			{ name: 'Ethnic wear', slug: 'women-ethnic-wear', children: [{ name: 'Kurtas', slug: 'women-kurtas' }] }
		]
	},
	{ name: 'Men', slug: 'men', children: [] }
]

describe('childrenOf', () => {
	it("lists a category's children with their pictures", () => {
		expect(childrenOf(tree, 'women')).toEqual([
			{ name: 'Dresses', href: '/women-dresses', image: '/media/d.webp' },
			{ name: 'Ethnic wear', href: '/women-ethnic-wear', image: null }
		])
	})

	it('finds a category at any depth', () => {
		expect(childrenOf(tree, 'women-ethnic-wear')).toEqual([{ name: 'Kurtas', href: '/women-kurtas', image: null }])
	})

	it('gives nothing for a category without children, an unknown slug or no tree', () => {
		expect(childrenOf(tree, 'men')).toEqual([])
		expect(childrenOf(tree, 'shoes')).toEqual([])
		expect(childrenOf(null, 'women')).toEqual([])
	})
})
