import { describe, expect, it, vi } from 'vitest'
import { addedTax, taxIsPending, totalLabel } from '$lib/utils/price'

vi.mock('$lib/core/utils', () => ({ formatPrice: vi.fn() }))

describe('taxIsPending', () => {
	it('is true when the store adds tax on top and the cart carries none yet', () => {
		expect(taxIsPending(false, 0)).toBe(true)
		expect(taxIsPending(false, undefined)).toBe(true)
		expect(taxIsPending(false, null)).toBe(true)
	})

	it('is false once the cart carries the tax', () => {
		expect(taxIsPending(false, 7.56)).toBe(false)
	})

	it('is false when prices include tax, or the store has not said', () => {
		expect(taxIsPending(true, 0)).toBe(false)
		expect(taxIsPending(undefined, 0)).toBe(false)
		expect(taxIsPending(null, 0)).toBe(false)
	})
})

describe('totalLabel', () => {
	it('names the bottom line for what it holds', () => {
		expect(totalLabel(true, false)).toBe('Total')
		expect(totalLabel(true, true)).toBe('Total before tax')
		expect(totalLabel(false, false)).toBe('Estimated total')
		expect(totalLabel(false, true)).toBe('Estimated total')
	})
})

describe('addedTax', () => {
	it('is the tax an order added on top of its prices', () => {
		expect(addedTax({ tax: 7.56, taxIncluded: false })).toBe(7.56)
	})

	it('is nothing when the prices already held the tax, or the order does not say', () => {
		expect(addedTax({ tax: 6.41, taxIncluded: true })).toBe(0)
		expect(addedTax({ tax: 6.41 })).toBe(0)
		expect(addedTax({ tax: 0, taxIncluded: false })).toBe(0)
		expect(addedTax(null)).toBe(0)
	})
})
