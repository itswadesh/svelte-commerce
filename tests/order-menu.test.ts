import { describe, expect, it } from 'vitest'
import { buildMenu, filterMenu } from '../src/lib/order/menu'

const cakes = { name: 'Cakes', slug: 'cakes' }
const products = [
	{
		id: 1,
		slug: 'chocolate-cake',
		title: 'Chocolate cake',
		thumbnail: '/cake.jpg',
		category: cakes,
		variants: [
			{ id: 11, title: '500 g', price: 450, stock: 3, manageInventory: true },
			{ id: 12, title: '1 kg', price: 850, stock: 0, manageInventory: true }
		]
	},
	{ id: 2, slug: 'pav', title: 'Pav (6)', variants: [{ id: 21, title: 'default', price: 30, manageInventory: false }] },
	{
		id: 3,
		slug: 'black-forest',
		title: 'Black forest',
		category: cakes,
		variants: [{ id: 31, title: '500 g', price: 480, stock: 0, manageInventory: true, allowBackorder: true }]
	},
	{ id: 4, slug: 'gone', title: 'No variants', variants: [] }
]

describe('the quick-order menu', () => {
	it('groups by category, uncategorised last, one row per size', () => {
		const menu = buildMenu(products)
		expect(menu.map((g) => [g.name, g.slug, g.items.map((i) => i.title)])).toEqual([
			['Cakes', 'cakes', ['Chocolate cake', 'Black forest']],
			['', 'other-items', ['Pav (6)']]
		])
		expect(menu[0].items[0].rows.map((r) => [r.label, r.price, r.soldOut])).toEqual([
			['500 g', 450, false],
			['1 kg', 850, true]
		])
	})

	it('names no size for a product sold one way, and sells a backordered size', () => {
		const menu = buildMenu(products)
		expect(menu[1].items[0].rows[0]).toMatchObject({ label: '', variantId: '21', soldOut: false })
		expect(menu[0].items[1].rows[0]).toMatchObject({ label: '', soldOut: false })
	})

	it('finds items by every word, in the name or a size', () => {
		const menu = buildMenu(products)
		expect(filterMenu(menu, 'cake 1 kg').flatMap((g) => g.items.map((i) => i.title))).toEqual(['Chocolate cake'])
		expect(filterMenu(menu, 'PAV')[0].items[0].title).toBe('Pav (6)')
		expect(filterMenu(menu, 'samosa')).toEqual([])
		expect(filterMenu(menu, '  ')).toBe(menu)
	})
})
