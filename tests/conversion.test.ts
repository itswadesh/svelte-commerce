import { describe, expect, it } from 'vitest'
import {
	ADDRESS_LABELS,
	PICKER_PILL_LIMIT,
	isIndianPin,
	pinAutofill,
	pickerChoices,
	soldLabel,
	usesSearchablePicker,
	variantFor,
	variantsWith
} from '../src/lib/product/conversion'

describe('the sold count', () => {
	it('says the band the engine counted, never a made-up number', () => {
		expect(soldLabel(30)).toBe('30+ sold')
		expect(soldLabel(400)).toBe('400+ sold')
		expect(soldLabel(1000)).toBe('1k+ sold')
		expect(soldLabel(45000)).toBe('45k+ sold')
		expect(soldLabel(null)).toBe('')
		expect(soldLabel(0)).toBe('')
		expect(soldLabel(undefined)).toBe('')
	})
})

describe('the device picker', () => {
	const values = (n: number) => Array.from({ length: n }, (_, i) => ({ id: String(i), value: `Model ${i}` }))
	it('keeps pills for a short list and searches a long one', () => {
		expect(usesSearchablePicker(values(PICKER_PILL_LIMIT))).toBe(false)
		expect(usesSearchablePicker(values(PICKER_PILL_LIMIT + 1))).toBe(true)
		expect(usesSearchablePicker(undefined)).toBe(false)
	})
	it('offers only the values that exist with what is already chosen, sold out ones disabled', () => {
		const status = (v: string) => (v === 'Model 1' ? 'unavailable' : v === 'Model 2' ? 'soldout' : v === 'Model 0' ? 'selected' : 'default')
		expect(pickerChoices(values(3), status)).toEqual([
			{ id: '0', value: 'Model 0', selected: true, disabled: false },
			{ id: '2', value: 'Model 2', selected: false, disabled: true }
		])
	})
})

describe('the PIN code', () => {
	it('is six digits in India, not starting with 0', () => {
		expect(isIndianPin('IN', '400001')).toBe(true)
		expect(isIndianPin('in', ' 560001 ')).toBe(true)
		expect(isIndianPin('IN', '040001')).toBe(false)
		expect(isIndianPin('IN', '4000')).toBe(false)
		expect(isIndianPin('US', '400001')).toBe(false)
	})
	it('fills an empty city and state, or the ones it filled before, never what the shopper typed', () => {
		const found = { city: 'Mumbai', state: 'Maharashtra' }
		expect(pinAutofill({ city: '', state: '' }, found, null)).toEqual({ city: 'Mumbai', state: 'Maharashtra' })
		expect(
			pinAutofill({ city: 'Pune', state: 'Maharashtra' }, { city: 'Mumbai', state: 'Maharashtra' }, { city: 'Pune', state: 'Maharashtra' })
		).toEqual({ city: 'Mumbai' })
		expect(pinAutofill({ city: 'Navi Mumbai', state: '' }, found, null)).toEqual({ state: 'Maharashtra' })
		expect(pinAutofill({ city: 'Mumbai', state: 'Maharashtra' }, found, null)).toEqual({})
	})
})

describe('the address label', () => {
	it('offers Home, Work and Other', () => {
		expect(ADDRESS_LABELS).toEqual(['Home', 'Work', 'Other'])
	})
})

describe('the cross-filter between options', () => {
	const options = [{ id: 'b' }, { id: 'm' }]
	const v = (id: string, brand: string, model: string) => ({
		id,
		options: [
			{ optionId: 'b', value: brand },
			{ optionId: 'm', value: model }
		]
	})
	const variants = [v('1', 'Apple', 'iPhone 15'), v('2', 'Apple', 'iPhone 16'), v('3', 'Samsung', 'Galaxy S24')]
	const chosen: [string, string][] = [
		['b', 'Apple'],
		['m', 'iPhone 15']
	]
	it('never blocks an earlier option by a later one, so the brand can always change', () => {
		expect(variantsWith(variants, options, chosen, 'b', 'Samsung').map((x) => x.id)).toEqual(['3'])
	})
	it('narrows a later option to what exists with the earlier ones', () => {
		expect(variantsWith(variants, options, chosen, 'm', 'iPhone 16').map((x) => x.id)).toEqual(['2'])
		expect(variantsWith(variants, options, chosen, 'm', 'Galaxy S24')).toEqual([])
	})
})

describe('choosing a value', () => {
	const options = [{ id: 's' }, { id: 'c' }, { id: 'm' }]
	const v = (id: string, size: string, colour: string, material: string, stock = 5) => ({
		id,
		stock,
		options: [
			{ optionId: 's', value: size },
			{ optionId: 'c', value: colour },
			{ optionId: 'm', value: material }
		]
	})
	const variants = [v('1', 'M', 'White', 'Silk'), v('2', 'S', 'Black', 'Cotton'), v('3', 'S', 'White', 'Linen', 0), v('4', 'S', 'White', 'Wool')]
	const chosen: [string, string][] = [
		['s', 'S'],
		['c', 'Black'],
		['m', 'Cotton']
	]
	const buyable = (x: { stock: number }) => x.stock > 0
	it('keeps the earlier choices and moves only the later ones, preferring what can be bought', () => {
		expect(variantFor(variants, options, chosen, 'c', 'White', buyable)?.id).toBe('4')
	})
	it('keeps every other choice when that combination exists', () => {
		expect(
			variantFor(
				variants,
				options,
				[
					['s', 'S'],
					['c', 'White'],
					['m', 'Linen']
				],
				'm',
				'Wool',
				buyable
			)?.id
		).toBe('4')
	})
	it('changes the later ones when an earlier value is chosen', () => {
		expect(variantFor(variants, options, chosen, 's', 'M', buyable)?.id).toBe('1')
	})
	it('finds nothing for a value that does not exist with the earlier choices', () => {
		expect(variantFor(variants, options, [['s', 'M']], 'm', 'Wool', buyable)).toBeNull()
	})
})
