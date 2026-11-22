import { describe, expect, it, vi } from 'vitest'
import { partialCodSplit, paymentFee, totalWithFee } from '$lib/utils/price'

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

describe('partialCodSplit', () => {
	const method = { advance: 99, minTotal: 198, fee: 20, refundNote: 'Refunded in full.' }
	const quote = (total: number, codCharges = 0, partialCod?: { payNow: number; payOnDelivery: number; refundNote: string }) => ({
		subtotal: total,
		shippingCharges: 0,
		discount: 0,
		coupon: null,
		tax: 0,
		taxIncluded: true,
		codCharges,
		total,
		partialCod
	})

	it('is the quote’s own split once checkout was asked for the method', () => {
		const split = { payNow: 99, payOnDelivery: 921, refundNote: 'Refunded in full.' }
		expect(partialCodSplit(method, quote(1020, 20, split), true, 0)).toEqual(split)
	})

	it('until then is the advance against the total on screen, with this method’s charge in place of the one quoted', () => {
		expect(partialCodSplit(method, quote(1040, 40), false, 0)).toEqual({ payNow: 99, payOnDelivery: 921, refundNote: 'Refunded in full.' })
		expect(partialCodSplit(method, null, false, 500)).toEqual({ payNow: 99, payOnDelivery: 421, refundNote: 'Refunded in full.' })
	})

	it('is not offered under twice the advance, nor for a method with no advance', () => {
		expect(partialCodSplit(method, quote(170), false, 0)).toBeNull()
		expect(partialCodSplit(method, quote(178), false, 0)?.payOnDelivery).toBe(99)
		expect(partialCodSplit({ name: 'Cash on delivery' } as never, quote(1000), false, 0)).toBeNull()
	})
})
