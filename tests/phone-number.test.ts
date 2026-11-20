import { describe, expect, it } from 'vitest'
import { withDialCode } from '../src/lib/utils/phone-number'

// The sign-in form adds the store's country code to a number typed without
// one. A number written the way it is dialled at home keeps its trunk 0
// (09876543210), which is not part of the international number.
describe('withDialCode', () => {
	it('adds the country code to a ten-digit number', () => {
		expect(withDialCode('9876543210', '+91')).toBe('+919876543210')
	})
	it('drops the trunk 0 a number is dialled with at home', () => {
		expect(withDialCode('09876543210', '+91')).toBe('+919876543210')
		expect(withDialCode('098765 43210', '+91')).toBe('+919876543210')
	})
	it('reads 00 as the international prefix', () => {
		expect(withDialCode('00919876543210', '+91')).toBe('+919876543210')
	})
	it('keeps a number that already has its country code', () => {
		expect(withDialCode('+91 98765 43210', '+91')).toBe('+919876543210')
		expect(withDialCode('919876543210', '+91')).toBe('+919876543210')
	})
	it('drops a trunk 0 typed after the country code', () => {
		expect(withDialCode('+9109876543210', '+91')).toBe('+919876543210')
	})
	it('keeps the 0 where it is part of the international number, as in Italy', () => {
		expect(withDialCode('06 1234 5678', '+39')).toBe('+390612345678')
		expect(withDialCode('+39 06 1234 5678', '+39')).toBe('+390612345678')
	})
})
