import { describe, expect, it, vi } from 'vitest'
import { taxIsPending, totalLabel } from '$lib/utils/price'

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
