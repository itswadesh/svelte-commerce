import { describe, expect, it } from 'vitest'
import { offerMinimum, offerValue, pageOffers, type BagOffer } from '../src/lib/product/upsells'

const offer = (over: Partial<BagOffer>): BagOffer => ({
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
const money = (n: number) => `₹${n}`

describe('the offers on a product page', () => {
	it('shows the listed codes and leaves out one that cannot be used here', () => {
		const shown = pageOffers([offer({}), offer({ code: 'SHIRTS', reason: 'This code is for other products' }), offer({ code: '' })])
		expect(shown.map((o) => o.code)).toEqual(['HELLO5'])
	})

	it('is empty for a store with no listed codes', () => {
		expect(pageOffers([])).toEqual([])
		expect(pageOffers(null)).toEqual([])
	})

	it('names what a code takes off and its minimum, never a price after it', () => {
		const big = offer({ code: 'BIG100', isPercent: false, value: 100, minAmount: 999 })
		expect(offerValue(big, money)).toBe('₹100 off')
		expect(offerMinimum(big, money)).toBe('On orders above ₹999')
		expect(offerMinimum(offer({}), money)).toBe('')
	})
})
