import { describe, expect, it } from 'vitest'
import { mainCategoryCookie, mainCategoryFromCookies, mainInTree, mainOfTrail, parseMainCategory } from '$lib/components/common/main-category'

describe('which main category the back buttons go to', () => {
	it('a subcategory listing remembers its top-level parent, not itself', () => {
		const trail = [
			{ name: 'Women', slug: 'women' },
			{ name: 'Dresses', slug: 'women-dresses' }
		]
		expect(mainOfTrail(trail)).toEqual({ name: 'Women', slug: 'women' })
		expect(mainOfTrail([])).toBeNull()
		expect(mainOfTrail(undefined)).toBeNull()
	})

	it('finds the top-level ancestor in a category tree or a header menu', () => {
		const tree = [
			{ name: 'Men', slug: 'men', children: [{ name: 'Kurtas', slug: 'men-kurtas' }] },
			{ name: 'Women', slug: 'women', children: [{ name: 'Dresses', slug: 'women-dresses', children: [{ name: 'Maxi', slug: 'maxi' }] }] }
		]
		expect(mainInTree(tree, 'maxi')).toEqual({ name: 'Women', slug: 'women' })
		expect(mainInTree(tree, 'men')).toEqual({ name: 'Men', slug: 'men' })
		expect(mainInTree(tree, 'shoes')).toBeNull()

		const menu = [
			{ name: 'Home', link: '/', items: [] },
			{ name: 'Women', link: '/women', items: [{ name: 'Dresses', link: '/women-dresses', items: [] }] }
		]
		expect(mainInTree(menu, 'women-dresses')).toEqual({ name: 'Women', slug: 'women' })
	})

	it('round-trips through the cookie and refuses anything that would leave the store', () => {
		const line = mainCategoryCookie({ name: 'Women & girls', slug: 'women' })
		const cookies = `theme=x; ${line.split(';')[0]}; other=1`
		expect(mainCategoryFromCookies(cookies)).toEqual({ name: 'Women & girls', slug: 'women' })
		expect(mainCategoryFromCookies('theme=x')).toBeNull()
		expect(parseMainCategory('{"name":"Evil","slug":"/evil.com"}')).toBeNull()
		expect(parseMainCategory('{"name":"Evil","slug":"javascript:alert(1)"}')).toBeNull()
		expect(parseMainCategory('not json')).toBeNull()
	})
})
