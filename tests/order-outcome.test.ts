import { describe, expect, it } from 'vitest'
import { isSale, orderOutcome, OUTCOME_COPY } from '$lib/checkout/order-outcome'

describe('orderOutcome', () => {
	it.each([
		['Razorpay, webhook landed', { paymentStatus: 'Paid', paymentMethod: 'RAZORPAY' }, 'paid'],
		['Razorpay, waiting for its webhook', { paymentStatus: 'Pending', paymentMethod: 'RAZORPAY' }, 'confirming'],
		['redirect gateway, waiting for its webhook', { paymentStatus: 'Pending', paymentMethod: 'PAYPAL' }, 'confirming'],
		['Cashfree, waiting for its webhook', { paymentStatus: 'Pending', paymentMethod: 'CASHFREE' }, 'confirming'],
		['Cashfree, attempt failed', { paymentStatus: 'Failed', paymentMethod: 'CASHFREE' }, 'failed'],
		['cash on delivery, unpaid until the doorstep', { paymentStatus: 'Pending', paymentMethod: 'COD' }, 'pay-on-delivery'],
		['cash on delivery, paid', { paymentStatus: 'Paid', paymentMethod: 'COD' }, 'paid'],
		['unpaid and cancelled', { paymentStatus: 'Pending', paymentMethod: 'CASHFREE', status: 'cancelled' }, 'failed'],
		['a backend reporting no payment state', { paymentMethod: 'STRIPE' }, 'received'],
		['a payment state this page has never seen', { paymentStatus: 'refunded', paymentMethod: 'RAZORPAY' }, 'received'],
		['no order', null, 'unknown']
	])('%s', (_name, order, want) => {
		expect(orderOutcome(order)).toBe(want)
	})
})

describe('what the page may claim', () => {
	const unpaid = ['confirming', 'failed', 'unknown'] as const

	it.each(unpaid)('%s thanks nobody and claims no payment', (outcome) => {
		const { heading, body, title } = OUTCOME_COPY[outcome]
		expect(`${heading} ${body}`).not.toMatch(/thank/i)
		expect(`${heading} ${body}`).not.toMatch(/went through/i)
		expect(title).not.toMatch(/confirmed/i)
		expect(isSale(outcome)).toBe(false)
	})

	it('only a settled payment says it went through', () => {
		const claims = Object.entries(OUTCOME_COPY).filter(([, c]) => /payment went through/i.test(c.body))
		expect(claims.map(([k]) => k)).toEqual(['paid'])
	})

	it('only a sale is counted as a purchase', () => {
		expect(isSale('paid')).toBe(true)
		expect(isSale('pay-on-delivery')).toBe(true)
		expect(isSale('received')).toBe(true)
	})
})
