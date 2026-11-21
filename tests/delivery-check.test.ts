import { describe, it, expect } from 'vitest'
import { deliveryMessage, validPostcode } from '$lib/product/delivery-check'

const answer = (over = {}) => ({ postcode: '560001', city: 'Bengaluru', deliverable: true, minDays: null, maxDays: null, ...over })

describe('validPostcode', () => {
	it('takes six digits in India, never starting with 0', () => {
		expect(validPostcode('IN', '560001')).toBe(true)
		expect(validPostcode('in', ' 560001 ')).toBe(true)
		expect(validPostcode('IN', '56001')).toBe(false)
		expect(validPostcode('IN', '060001')).toBe(false)
		expect(validPostcode('IN', '5600011')).toBe(false)
		expect(validPostcode('IN', '56000a')).toBe(false)
	})

	it('takes 3 to 10 letters or digits elsewhere', () => {
		expect(validPostcode('GB', 'SW1A 1AA')).toBe(true)
		expect(validPostcode('US', '12345')).toBe(true)
		expect(validPostcode('US', '12')).toBe(false)
	})
})

describe('deliveryMessage', () => {
	it('says the range, one number when it is one, or just the place', () => {
		expect(deliveryMessage(answer({ minDays: 2, maxDays: 4 }))).toBe('Delivers to Bengaluru in 2–4 days')
		expect(deliveryMessage(answer({ minDays: 3, maxDays: 3 }))).toBe('Delivers to Bengaluru in 3 days')
		expect(deliveryMessage(answer({ minDays: 1, maxDays: 1 }))).toBe('Delivers to Bengaluru in 1 day')
		expect(deliveryMessage(answer({ maxDays: 5 }))).toBe('Delivers to Bengaluru in 5 days')
		expect(deliveryMessage(answer())).toBe('Delivers to Bengaluru')
	})

	it('names the PIN when the directory has no city', () => {
		expect(deliveryMessage(answer({ city: '' }))).toBe('Delivers to 560001')
	})

	it('says sorry when it does not deliver, whatever the reason', () => {
		expect(deliveryMessage(answer({ deliverable: false }))).toBe('Sorry, delivery is not available at your PIN code.')
		expect(deliveryMessage(answer({ deliverable: false, unknownPostcode: true }))).toBe('Sorry, delivery is not available at your PIN code.')
	})
})
