import { describe, expect, it, vi } from 'vitest'
import { paymentFee, totalWithFee } from '$lib/utils/price'

vi.mock('$lib/core/utils', () => ({ formatPrice: vi.fn() }))

describe('paymentFee', () => {
	it('is what the chosen method adds to the order, named for the price summary', () => {
		expect(paymentFee({ name: 'Cash on delivery', fee: 60 })).toEqual({ label: 'Cash on delivery charge', amount: 60 })
	})

	it('is nothing for a method without one, or for no method chosen yet', () => {
		expect(paymentFee({ name: 'Razorpay', fee: 0 })).toBeNull()
		expect(paymentFee({ name: 'Cash on delivery' })).toBeNull()
		expect(paymentFee(undefined)).toBeNull()
		expect(paymentFee(null)).toBeNull()
	})

	it('never takes money off the total', () => {
		expect(paymentFee({ name: 'Cash on delivery', fee: -60 })).toBeNull()
		expect(paymentFee({ name: 'Cash on delivery', fee: Number.NaN })).toBeNull()
	})
})

describe('totalWithFee', () => {
	it('adds the fee to the cart total', () => {
		expect(totalWithFee(63, { label: 'Cash on delivery charge', amount: 60 })).toBe(123)
	})

	it('is the cart total when no fee applies', () => {
		expect(totalWithFee(63, null)).toBe(63)
		expect(totalWithFee(undefined, null)).toBe(0)
	})
})
