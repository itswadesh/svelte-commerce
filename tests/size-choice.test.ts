import { describe, expect, it } from 'vitest'
import { lineSizes, needsSize, sizeChoices, sizeOf, sizeOptionOf, stockSourceOf, withoutSize } from '../src/lib/product/size-choice.svelte'
import { isOutOfStock } from '../src/lib/product/stock'

const size = { id: 1, title: 'Size', values: [{ value: 'S' }, { value: 'M' }, { value: 'L' }] }
const colour = { id: 2, title: 'Colour', values: [{ value: 'Red' }, { value: 'Blue' }] }
const v = (id: number, s: string, c: string, stock = 5) => ({
	id: String(id),
	title: `${s} / ${c}`,
	sku: `SKU-${id}`,
	stock,
	options: [
		{ optionId: 1, value: s },
		{ optionId: 2, value: c }
	]
})
const shirt = {
	id: 9,
	options: [size, colour],
	variants: [v(1, 'S', 'Red'), v(2, 'M', 'Red', 0), v(3, 'L', 'Red'), v(4, 'S', 'Blue'), v(5, 'M', 'Blue')]
}

describe('the size a shopper has to pick', () => {
	it('asks until a size is named, and not after', () => {
		expect(needsSize(shirt, shirt.variants[0])).toBe(false)
		expect(needsSize(shirt, withoutSize(shirt.variants[0], size))).toBe(true)
	})

	it('adds in one tap where there is no size to choose', () => {
		expect(needsSize({ options: [colour], variants: [v(1, 'S', 'Red')] }, { options: [] })).toBe(false)
		expect(needsSize({ options: [{ id: 1, title: 'Size', values: [{ value: 'Free size' }] }] }, { options: [] })).toBe(false)
		expect(needsSize({ options: [], variants: [{ id: '1', title: 'default' }] }, { id: '1' })).toBe(false)
		expect(needsSize(null, null)).toBe(false)
	})

	it('knows a size option by its title or its type', () => {
		expect(sizeOptionOf({ options: [colour, { id: 3, title: 'Fit', type: 'Size', values: [{ value: 'A' }, { value: 'B' }] }] })?.id).toBe(3)
		expect(sizeOptionOf({ options: [colour] })).toBeNull()
	})

	it('holds the variant without anything that belongs to one size', () => {
		const held = withoutSize(shirt.variants[0], size)
		expect(sizeOf(held, size)).toBeUndefined()
		expect(held.options).toEqual([{ optionId: 2, value: 'Red' }])
		expect([held.id, held.title, held.sku]).toEqual([undefined, undefined, undefined])
		expect(held.stock).toBe(5)
	})
})

describe('the sizes the sheet offers', () => {
	it('keeps the colour already chosen, and marks a sold-out size', () => {
		const held = withoutSize(shirt.variants[0], size)
		expect(sizeChoices(shirt, held).map((c) => [c.value, c.variant.id, c.soldOut])).toEqual([
			['S', '1', false],
			['M', '2', true],
			['L', '3', false]
		])
	})

	it('moves to a colour that has the size when the chosen one does not', () => {
		const blue = withoutSize(shirt.variants[3], size)
		expect(sizeChoices(shirt, blue).map((c) => [c.value, c.variant.id])).toEqual([
			['S', '4'],
			['M', '5'],
			['L', '3']
		])
	})

	it('offers nothing for a product with no size to choose', () => {
		expect(sizeChoices({ options: [colour], variants: [] }, null)).toEqual([])
	})
})

describe('the stock the badge and the button read', () => {
	const tracked = (x: ReturnType<typeof v>) => ({ ...x, manageInventory: true, allowBackorder: false })
	const out = (p: Parameters<typeof stockSourceOf>[0], selected: Parameters<typeof stockSourceOf>[1]) =>
		isOutOfStock(stockSourceOf(p, selected) as never)
	const product = { ...shirt, variants: shirt.variants.map(tracked), manageInventory: true, stock: 20 }

	it('is out of stock when every size is sold out, whatever the product total says', () => {
		const soldOut = { ...product, variants: product.variants.map((x) => ({ ...x, stock: 0 })) }
		expect(out(soldOut, withoutSize(soldOut.variants[0], size))).toBe(true)
		// Red is gone in every size while Blue still has some: the held colour answers, not the total.
		const redGone = { ...product, variants: product.variants.map((x) => (x.title.endsWith('Red') ? { ...x, stock: 0 } : x)) }
		expect(out(redGone, withoutSize(redGone.variants[0], size))).toBe(true)
	})

	it('is in stock with no size picked while some sizes are left', () => {
		const held = withoutSize(product.variants[0], size)
		expect(out(product, held)).toBe(false)
		expect(stockSourceOf(product, held)?.stock).toBe(10)
	})

	it('is out of stock for a sold-out size once it is picked, and in for one that is not', () => {
		expect(out(product, product.variants[1])).toBe(true)
		expect(out(product, product.variants[0])).toBe(false)
	})

	it('reads the variant of a product with no size to choose', () => {
		const single = { options: [], variants: [{ id: '1', title: 'default', stock: 0, manageInventory: true }], stock: 0 }
		expect(stockSourceOf(single, single.variants[0])).toBe(single.variants[0])
		expect(stockSourceOf(single, null)).toBe(single)
	})
})

describe('changing a bag line’s size', () => {
	it('offers the other sizes in the line’s colour, with the one it has', () => {
		const sizes = lineSizes(shirt, { variantId: '4' })
		expect(sizes?.title).toBe('Size')
		expect(sizes?.value).toBe('S')
		expect(sizes?.choices.map((c) => [c.value, c.variant.id])).toEqual([
			['S', '4'],
			['M', '5'],
			['L', '3']
		])
	})

	it('matches the line’s variant whether its id is a number or a string', () => {
		const numeric = { ...shirt, variants: shirt.variants.map((x) => ({ ...x, id: Number(x.id) })) }
		expect(lineSizes(numeric, { variantId: '2' })?.value).toBe('M')
	})

	it('has nothing to change for a line with no size, or a variant the product no longer has', () => {
		expect(lineSizes({ options: [colour], variants: [v(1, 'S', 'Red')] }, { variantId: '1' })).toBeNull()
		expect(lineSizes(shirt, { variantId: '99' })).toBeNull()
		expect(lineSizes(null, { variantId: '1' })).toBeNull()
	})
})
