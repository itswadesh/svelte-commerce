import { describe, expect, it } from 'vitest'
import { colourPaint, productColours, swatchPaint } from '$lib/product/colour'

describe('colourPaint', () => {
	it('knows garment names, whatever their case and spacing', () => {
		expect(colourPaint('Royal blue')).toBe('#2a52be')
		expect(colourPaint('rani-pink')).toBe('#e0218a')
		expect(colourPaint(' Bottle  Green ')).toBe('#0b4d2c')
		expect(colourPaint('Cream')).toBe('#f3ead3')
	})

	it('lightens or darkens a name it knows', () => {
		expect(colourPaint('Light blue')).toBe('color-mix(in srgb, #2f5dc8, white 45%)')
		expect(colourPaint('Dark green')).toBe('color-mix(in srgb, #2e7d32, black 35%)')
		expect(colourPaint('Light multicolour')).toBeNull()
	})

	it('takes a whole colour code and nothing else', () => {
		expect(colourPaint('#ABC')).toBe('#ABC')
		expect(colourPaint('rgb(10, 20, 30)')).toBe('rgb(10, 20, 30)')
		expect(colourPaint('rgb(1,2,3); position: fixed')).toBeNull()
		expect(colourPaint('Rose Gold Shimmer')).toBeNull()
		expect(colourPaint('')).toBeNull()
	})
})

describe('swatchPaint', () => {
	it("prefers the connector's code, if it is a real one", () => {
		expect(swatchPaint({ value: 'Ocean', colorCode: '#123456' })).toBe('#123456')
		expect(swatchPaint({ value: 'Navy', hex: 'url(x)' })).toBe('#1f2a52')
		expect(swatchPaint(null)).toBeNull()
	})
})

describe('productColours', () => {
	const colour = { name: 'Colour', type: 'text', values: [{ value: 'Royal blue' }, { value: 'Wine' }, { value: 'Ocean' }] }
	const size = { name: 'Size', type: 'text', values: [{ value: 'S' }, { value: 'M' }] }

	it("lists the colour option's values, painted where it can", () => {
		expect(productColours({ options: [size, colour] })).toEqual([
			{ name: 'Royal blue', paint: '#2a52be' },
			{ name: 'Wine', paint: '#722f37' },
			{ name: 'Ocean', paint: null }
		])
		expect(productColours({ options: [{ title: 'Color', values: [{ value: 'Red' }, { value: 'Blue' }] }] })).toHaveLength(2)
		expect(productColours({ options: [{ name: 'Finish', type: 'Color', values: [{ value: 'Red' }, { value: 'Blue' }] }] })).toHaveLength(2)
	})

	it('says nothing for one colour, or none', () => {
		expect(productColours({ options: [{ name: 'Colour', values: [{ value: 'Red' }] }] })).toEqual([])
		expect(productColours({ options: [size] })).toEqual([])
		expect(productColours({})).toEqual([])
		expect(productColours(null)).toEqual([])
	})
})
