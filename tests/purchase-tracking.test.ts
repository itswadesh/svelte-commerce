import { describe, it, expect, vi, beforeEach } from 'vitest'

const fireGTagEvent = vi.fn()
const klaviyoTrackPlacedOrder = vi.fn()
const klaviyoIdentify = vi.fn()

vi.mock('$lib/core/utils/index.js', () => ({ fireGTagEvent }))
vi.mock('$lib/klaviyo', () => ({ klaviyoTrackPlacedOrder, klaviyoIdentify }))

const { toPurchase, trackOrderPlaced } = await import('$lib/purchase-tracking')

const order = (over: Record<string, any> = {}) => ({
	id: 'order_1',
	orderNo: 1001,
	parentOrderNo: 'parent_order_abc',
	total: 120,
	tax: 10,
	shippingCharges: 5,
	amount: { total: 120, shipping: 5 },
	lineItems: [{ productId: 'prod_1', title: 'Gold ring', sku: 'GR-1', price: 115, qty: 1 }],
	...over
})

describe('toPurchase', () => {
	it('uses the order number as the transaction id for a single order', () => {
		const p = toPurchase([order()])
		expect(p?.orderNo).toBe(1001)
		expect(p?.amount.total).toBe(120)
	})

	it('maps line items to the fields fireGTagEvent reads', () => {
		const p = toPurchase([order()])
		expect(p?.items).toEqual([expect.objectContaining({ _id: 'prod_1', name: 'Gold ring', sku: 'GR-1', price: 115, qty: 1 })])
	})

	it('combines vendor orders into one purchase under the parent order number', () => {
		const p = toPurchase([
			order(),
			order({ orderNo: 1002, total: 80, tax: 4, shippingCharges: 3, amount: { total: 80, shipping: 3 }, lineItems: [{ productId: 'prod_2', title: 'Bangle', price: 77, qty: 1 }] })
		])
		expect(p?.orderNo).toBe('parent_order_abc')
		expect(p?.amount.total).toBe(200)
		expect(p?.amount.shipping).toBe(8)
		expect(p?.tax).toBe(14)
		expect(p?.items).toHaveLength(2)
	})

	it('returns null when there are no orders', () => {
		expect(toPurchase([])).toBeNull()
	})
})

describe('trackOrderPlaced', () => {
	beforeEach(() => {
		fireGTagEvent.mockClear()
		klaviyoTrackPlacedOrder.mockClear()
		klaviyoIdentify.mockClear()
		localStorage.clear()
		sessionStorage.clear()
	})

	it('sends the purchase to Google and Klaviyo', () => {
		trackOrderPlaced([order()], 'USD')
		expect(fireGTagEvent).toHaveBeenCalledWith('purchase', expect.objectContaining({ orderNo: 1001 }))
		expect(klaviyoTrackPlacedOrder).toHaveBeenCalledWith(expect.objectContaining({ orderNo: 1001 }), 'USD')
	})

	it('identifies a guest buyer to Klaviyo before Placed Order', () => {
		trackOrderPlaced([order({ userEmail: 'guest@example.com', shippingAddress: { firstName: 'Asha', lastName: 'Rao', phone: '98765 43210' } })], 'USD')
		expect(klaviyoIdentify).toHaveBeenCalledWith({ email: 'guest@example.com', firstName: 'Asha', lastName: 'Rao' })
		expect(klaviyoIdentify.mock.invocationCallOrder[0]).toBeLessThan(klaviyoTrackPlacedOrder.mock.invocationCallOrder[0])
	})

	it('falls back to the address email and skips identify without one', () => {
		trackOrderPlaced([order({ orderNo: 2001, shippingAddress: { email: 'addr@example.com' } })], 'USD')
		expect(klaviyoIdentify).toHaveBeenCalledWith(expect.objectContaining({ email: 'addr@example.com' }))

		klaviyoIdentify.mockClear()
		trackOrderPlaced([order({ orderNo: 2002 })], 'USD')
		expect(klaviyoIdentify).not.toHaveBeenCalled()
		expect(klaviyoTrackPlacedOrder).toHaveBeenCalledTimes(2)
	})

	it('does not send the same order twice when the page is reopened', () => {
		trackOrderPlaced([order()], 'USD')
		trackOrderPlaced([order()], 'USD')
		expect(fireGTagEvent).toHaveBeenCalledTimes(1)
		expect(klaviyoTrackPlacedOrder).toHaveBeenCalledTimes(1)
	})

	it('still tracks a second, different order in the same tab', () => {
		// fireGTagEvent keeps one session-wide purchase lock that is not keyed by order
		sessionStorage.setItem('event_fired_purchase', 'true')
		trackOrderPlaced([order({ orderNo: 1003 })], 'USD')
		expect(sessionStorage.getItem('event_fired_purchase')).toBeNull()
		expect(fireGTagEvent).toHaveBeenCalledTimes(1)
	})

	it('does nothing without orders', () => {
		trackOrderPlaced([], 'USD')
		expect(fireGTagEvent).not.toHaveBeenCalled()
		expect(klaviyoTrackPlacedOrder).not.toHaveBeenCalled()
	})
})
