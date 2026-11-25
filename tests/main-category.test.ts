import { describe, expect, it } from 'vitest'
import {
	appHeaderFor,
	mainCategoryCookie,
	mainCategoryFromCookies,
	mainInTree,
	mainOfTrail,
	parseMainCategory
} from '$lib/components/common/main-category'

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

	it('the listing header goes up one level, and search results go to the main category', () => {
		const url = (q = '') => new URL(`https://shop.test/x${q}`)
		const women = { name: 'Women', slug: 'women' }
		const dresses = { name: 'Dresses', slug: 'women-dresses' }
		expect(appHeaderFor('/(www)/[slug]', url(), [women, dresses], null)).toEqual({ title: 'Dresses', href: '/women', label: 'Back to Women' })
		expect(appHeaderFor('/(www)/[slug]', url(), [women], null)).toEqual({ title: 'Women', href: '/', label: 'Back to home' })
		expect(appHeaderFor('/(www)/[slug]', url(), [], null)).toBeNull()
		expect(appHeaderFor('/(www)/products', url('?search=dress'), undefined, women)).toEqual({
			title: '“dress”',
			href: '/women',
			label: 'Back to Women'
		})
		// Searched without browsing a category: home, like All products itself.
		expect(appHeaderFor('/(www)/products', url('?search=dress'), undefined, null)).toEqual({ title: '“dress”', href: '/', label: 'Back to home' })
		// All products, plain, sorted or filtered, keeps the heading the page prints.
		expect(appHeaderFor('/(www)/products', url(), undefined, women)).toEqual({ title: 'All products', href: '/', label: 'Back to home' })
		expect(appHeaderFor('/(www)/products', url('?sort=price:asc&colour=Navy'), [], null)?.title).toBe('All products')
		expect(appHeaderFor('/(www)/products/[slug]', url(), [women], women)).toBeNull()
	})
})
