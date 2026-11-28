import { afterEach, describe, expect, it } from 'vitest'
import { cancelView, keptOrderToken, sentence } from '../src/lib/components/order/order-cancel'

describe('cancelView', () => {
	it('shows the button only when the engine says so', () => {
		expect(cancelView({ cancellable: true }).cancellable).toBe(true)
		expect(cancelView({}).cancellable).toBe(false)
		expect(cancelView(null).cancellable).toBe(false)
	})
	it('promises a refund only for an order paid online', () => {
		expect(cancelView({ payment_provider: 'razorpay', payment_status: 'paid' }).prepaid).toBe(true)
		expect(cancelView({ payment_provider: 'cashfree', payment_status: 'refunded' }).prepaid).toBe(true)
		expect(cancelView({ payment_provider: 'cod', payment_status: 'pending' }).prepaid).toBe(false)
		expect(cancelView({ payment_provider: 'cod_partial', payment_status: 'paid' }).prepaid).toBe(false)
		expect(cancelView({ payment_provider: 'razorpay', payment_status: 'pending' }).prepaid).toBe(false)
		// A direct UPI transfer is refunded by the store by hand, not "started" by a gateway.
		expect(cancelView({ payment_provider: 'upi', payment_status: 'paid' }).prepaid).toBe(false)
		expect(cancelView({ payment_provider: 'upi', payment_status: 'paid' }).paidDirect).toBe(true)
		expect(cancelView({ payment_provider: 'razorpay', payment_status: 'paid' }).paidDirect).toBe(false)
	})
	it('reads a request only when it has a status', () => {
		expect(cancelView({ cancellation: { status: 'pending' } }).cancellation?.status).toBe('pending')
		expect(cancelView({ cancellation: {} }).cancellation).toBeNull()
	})
})

describe('keptOrderToken', () => {
	afterEach(() => localStorage.clear())
	it('finds the key the connector kept for the order', () => {
		localStorage.setItem(
			'gocommerce_orders',
			JSON.stringify([
				{ number: 'GC-1', token: 'k1' },
				{ number: 'GC-2', token: 'k2' }
			])
		)
		expect(keptOrderToken('GC-2')).toBe('k2')
		expect(keptOrderToken('GC-3')).toBeUndefined()
	})
	it('survives nothing kept and a broken value', () => {
		expect(keptOrderToken('GC-1')).toBeUndefined()
		localStorage.setItem('gocommerce_orders', '{not json')
		expect(keptOrderToken('GC-1')).toBeUndefined()
	})
})

describe('sentence', () => {
	it('capitalises the engine message and leaves it otherwise as given', () => {
		expect(sentence('order GC-1 has already shipped, so it can no longer be cancelled')).toBe(
			'Order GC-1 has already shipped, so it can no longer be cancelled'
		)
		expect(sentence(undefined)).toBe('')
	})
})
