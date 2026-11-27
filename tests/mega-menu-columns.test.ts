import { describe, expect, it } from 'vitest'
import { isMega, megaColumns, menuKey, promoImage } from '$lib/components/nav/mega-menu-columns'

const women = {
	name: 'Women',
	link: '/women',
	items: [
		{
			name: 'Ethnic wear',
			link: '/women-ethnic-wear',
			items: [
				{ name: 'Sarees', link: '/women-sarees', items: [{ name: 'Silk', link: '/silk' }] },
				{ name: 'Kurtas', link: '/women-kurtas', items: [] }
			]
		},
		{ name: 'Dresses', link: '/women-dresses', items: [] },
		{ name: '', link: '/nameless', items: [] },
		{ name: 'No link', link: '', items: [] }
	]
}

describe('megaColumns', () => {
	it('makes each second-level item a column of its third-level links', () => {
		expect(megaColumns(women)).toEqual([
			{
				name: 'Ethnic wear',
				link: '/women-ethnic-wear',
				links: [
					{ name: 'Sarees', link: '/women-sarees' },
					{ name: 'Kurtas', link: '/women-kurtas' }
				]
			},
			{ name: 'Dresses', link: '/women-dresses', links: [] }
		])
	})

	it('drops a node with no name or no link, so nothing links nowhere', () => {
		const names = megaColumns(women).map((c) => c.name)
		expect(names).not.toContain('')
		expect(names).not.toContain('No link')
	})

	it('reads category trees, which nest under children', () => {
		expect(
			megaColumns({ name: 'Men', link: '/men', children: [{ name: 'Kurtas', link: '/men-kurtas', children: [{ name: 'Sets', link: '/sets' }] }] })
		).toEqual([{ name: 'Kurtas', link: '/men-kurtas', links: [{ name: 'Sets', link: '/sets' }] }])
	})

	it('gives no columns for a leaf or a missing item', () => {
		expect(megaColumns({ name: 'Contact', link: '/contact-us', items: [] })).toEqual([])
		expect(megaColumns(undefined)).toEqual([])
	})
})

describe('promoImage', () => {
	it('uses only a picture the data gives', () => {
		expect(promoImage(women)).toBeUndefined()
		expect(promoImage({ thumbnail: '/t.jpg' })).toBe('/t.jpg')
		expect(promoImage({ image: '/i.jpg', thumbnail: '/t.jpg' })).toBe('/i.jpg')
	})
})

describe('menuKey', () => {
	it('moves forward and back with either arrow pair, wrapping at the ends', () => {
		expect(menuKey('ArrowRight', 0, 3)).toBe(1)
		expect(menuKey('ArrowDown', 2, 3)).toBe(0)
		expect(menuKey('ArrowLeft', 0, 3)).toBe(2)
		expect(menuKey('ArrowUp', 1, 3)).toBe(0)
	})

	it('jumps to the ends with Home and End', () => {
		expect(menuKey('Home', 2, 3)).toBe(0)
		expect(menuKey('End', 0, 3)).toBe(2)
	})

	it('leaves other keys, and an empty row, alone', () => {
		expect(menuKey('Tab', 0, 3)).toBe(-1)
		expect(menuKey('Enter', 0, 3)).toBe(-1)
		expect(menuKey('ArrowDown', 0, 0)).toBe(-1)
	})
})

describe('isMega', () => {
	it('is the full-width panel only when some second-level item has links of its own', () => {
		expect(isMega(megaColumns(women))).toBe(true)
		expect(isMega(megaColumns({ name: 'Men', link: '/men', items: [{ name: 'Shirts', link: '/shirts', items: [] }] }))).toBe(false)
	})
})
