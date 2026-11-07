import { describe, it, expect } from 'vitest'
import { emiNoteText } from '$lib/product/emi-note'

describe('emiNoteText', () => {
	it('says nothing until the store switches it on, or outside rupees', () => {
		expect(emiNoteText(undefined, 10000, 'INR')).toBeNull()
		expect(emiNoteText({ active: false, noCostMonths: 3 }, 10000, 'INR')).toBeNull()
		expect(emiNoteText({ active: true, noCostMonths: 3 }, 10000, 'USD')).toBeNull()
		expect(emiNoteText({ active: true }, 0, 'INR')).toBeNull()
	})

	it('names no amount without a no-cost offer', () => {
		expect(emiNoteText({ active: true }, 10000, 'INR')).toBe('EMI available at checkout')
		expect(emiNoteText({ active: true, noCostMonths: 1 }, 10000, 'INR')).toBe('EMI available at checkout')
	})

	it('divides by the offer months, rounded up to the rupee', () => {
		expect(emiNoteText({ active: true, noCostMonths: 3 }, 10000, 'inr')).toBe('No-cost EMI from ₹3,334/month')
		expect(emiNoteText({ active: true, noCostMonths: 6 }, 120000, 'INR')).toBe('No-cost EMI from ₹20,000/month')
		expect(emiNoteText({ active: true, noCostMonths: 3 }, 2999.5, 'INR')).toBe('No-cost EMI from ₹1,000/month')
	})

	it('hides under the minimum price, in minor units', () => {
		expect(emiNoteText({ active: true, minPrice: 300000 }, 2999, 'INR')).toBeNull()
		expect(emiNoteText({ active: true, minPrice: 300000 }, 3000, 'INR')).toBe('EMI available at checkout')
	})
})
