import { describe, expect, it } from 'vitest'
import { lineSizes, needsSize, sizeChoices, sizeOf, sizeOptionOf, withoutSize } from '../src/lib/product/size-choice.svelte'

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
