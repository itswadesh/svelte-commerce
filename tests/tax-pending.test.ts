import { describe, expect, it, vi } from 'vitest'
import { addedTax, taxIsPending, totalLabel } from '$lib/utils/price'

vi.mock('$lib/core/utils', () => ({ formatPrice: vi.fn() }))

describe('taxIsPending', () => {
	const taxLeftOut = { subtotal: 151, shippingCharges: 0, tax: 0, taxIncluded: false, codCharges: 0, total: 151 }
	const finalTotal = { subtotal: 151, shippingCharges: 0, codCharges: 0, tax: 0, total: 151, savingAmount: 0, discountAmount: 0 }

	it('is true when the cart leaves its tax out and the store adds tax on top', () => {
		expect(taxIsPending(false, taxLeftOut)).toBe(true)
	})

	it('is true when the cart leaves its tax out and the store has not said', () => {
		expect(taxIsPending(undefined, taxLeftOut)).toBe(true)
	})

	it('is false when the store says its prices include tax', () => {
		expect(taxIsPending(true, taxLeftOut)).toBe(false)
	})

	it('is false once the cart carries the tax', () => {
		expect(taxIsPending(false, { ...taxLeftOut, tax: 7.56 })).toBe(false)
	})

	it('is false for a cart that does not say its tax is left out, whatever the store says', () => {
		expect(taxIsPending(false, finalTotal)).toBe(false)
		expect(taxIsPending(false, { ...finalTotal, taxIncluded: true })).toBe(false)
	})

	it('is false before there is a cart', () => {
		expect(taxIsPending(false, null)).toBe(false)
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
