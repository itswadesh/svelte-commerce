import { describe, expect, it } from 'vitest'
import { bumpTotal, freeDeliveryState, offerNote, offerValue, sortOffers, type BagOffer } from '../src/lib/product/upsells'

const rupees = (n: number) => `₹${n}`
const offer = (over: Partial<BagOffer> = {}): BagOffer => ({
	code: 'HELLO5',
	title: '5% off',
	isPercent: true,
	value: 5,
	minAmount: null,
	applies: false,
	amount: null,
	remaining: null,
	...over
})

describe('the order bump', () => {
	it('adds each ticked add-on at the price ticking it adds', () => {
		expect(bumpTotal(179, [{ price: 49 }, { price: 29 }])).toBe(257)
		expect(bumpTotal(0.1, [{ price: 0.2 }])).toBe(0.3)
		expect(bumpTotal(179, [])).toBe(179)
	})
})

describe('the free-delivery bar', () => {
	it('shows how far there is to go, from the store’s own threshold', () => {
		expect(freeDeliveryState({ qualifies: false, threshold: 499, remaining: 370, subtotal: 129 })).toEqual({
			qualifies: false,
			remaining: 370,
			progress: (499 - 370) / 499
		})
	})
	it('is full when delivery is already free', () => {
		expect(freeDeliveryState({ qualifies: true, threshold: null, remaining: null, subtotal: 600 })).toEqual({ qualifies: true, remaining: 0, progress: 1 })
	})
	it('draws nothing when there is no threshold to reach, or no answer', () => {
		expect(freeDeliveryState({ qualifies: false, threshold: null, remaining: null, subtotal: 100 })).toBeNull()
		expect(freeDeliveryState(null)).toBeNull()
	})
})

describe('the bag’s offers', () => {
	it('says what an offer is worth and what it still needs', () => {
		expect(offerValue(offer(), rupees)).toBe('5% off')
		expect(offerValue(offer({ isPercent: false, value: 100 }), rupees)).toBe('₹100 off')
		expect(offerValue(offer({ freeShipping: true }), rupees)).toBe('Free delivery')
		expect(offerNote(offer({ applies: true, amount: 6.45 }), rupees)).toBe('You save ₹6.45')
		expect(offerNote(offer({ remaining: 171 }), rupees)).toBe('Add ₹171 more to use this')
		expect(offerNote(offer({ reason: 'that discount does not apply to anything in this basket' }), rupees)).toMatch(/does not apply/)
	})
	it('lists what applies first, then what is nearest', () => {
		const sorted = sortOffers([
			offer({ code: 'FAR', remaining: 670 }),
			offer({ code: 'NOW', applies: true }),
			offer({ code: 'NEAR', remaining: 171 })
		])
		expect(sorted.map((o) => o.code)).toEqual(['NOW', 'NEAR', 'FAR'])
	})
})
