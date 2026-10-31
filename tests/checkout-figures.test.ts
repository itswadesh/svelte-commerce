import { describe, expect, it, vi } from 'vitest'
import { checkoutFigures, type CheckoutQuote } from '$lib/utils/price'

vi.mock('$lib/core/utils', () => ({ formatPrice: vi.fn() }))

const cart = { subtotal: 1000, discountAmount: 0, shippingCharges: 49, tax: 0, taxIncluded: false, total: 1049 }
const cod = { name: 'Cash on delivery', fee: 40 }
const auto10: CheckoutQuote = {
	subtotal: 1000,
	shippingCharges: 49,
	discount: 100,
	coupon: { code: 'AUTO10', autoApplied: true, freeShipping: false },
	tax: 162,
	taxIncluded: false,
	codCharges: 40,
	total: 1151
}

describe('checkoutFigures', () => {
	it('is the sums from the cart when there is no quote', () => {
		expect(checkoutFigures(cart, cod, false, null)).toEqual({
			subtotal: 1000,
			discount: 0,
			coupon: null,
			shipping: 49,
			fee: { label: 'Cash on delivery charge', amount: 40 },
			tax: 0,
			total: 1089,
			taxPending: true
		})
	})

	it("is the quote's figures, with its own total and its own payment charge", () => {
		expect(checkoutFigures(cart, { name: 'Cash on delivery', fee: 60 }, false, auto10)).toEqual({
			subtotal: 1000,
			discount: 100,
			coupon: { code: 'AUTO10', autoApplied: true, freeShipping: false },
			shipping: 49,
			fee: { label: 'Cash on delivery charge', amount: 40 },
			tax: 162,
			total: 1151,
			taxPending: false
		})
	})

	it('shows no tax row for a quote whose prices already hold the tax', () => {
		const figures = checkoutFigures(cart, cod, true, { ...auto10, tax: 152.54, taxIncluded: true, total: 989 })
		expect(figures.tax).toBe(0)
		expect(figures.total).toBe(989)
		expect(figures.taxPending).toBe(false)
	})

	it('passes a free-delivery code through', () => {
		const freeShip: CheckoutQuote = {
			...auto10,
			discount: 0,
			coupon: { code: 'SHIPFREE', autoApplied: false, freeShipping: true },
			shippingCharges: 0,
			codCharges: 0,
			total: 1162
		}
		expect(checkoutFigures(cart, { name: 'Razorpay', fee: 0 }, false, freeShip)).toMatchObject({
			discount: 0,
			coupon: { code: 'SHIPFREE', autoApplied: false, freeShipping: true },
			shipping: 0,
			fee: null,
			total: 1162
		})
	})
})
