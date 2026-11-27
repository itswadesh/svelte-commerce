import { describe, expect, it } from 'vitest'
import { shipsFromLabel } from '../src/lib/utils/ships-from'

describe('shipsFromLabel', () => {
	it('reads the day as a calendar day, never a UTC instant', () => {
		expect(shipsFromLabel({ shipsFrom: '2026-12-18' })).toBe('Ships from 18 Dec 2026')
	})
	it('says nothing without a day', () => {
		expect(shipsFromLabel({ shipsFrom: null })).toBe('')
		expect(shipsFromLabel({})).toBe('')
		expect(shipsFromLabel(null)).toBe('')
		expect(shipsFromLabel({ shipsFrom: 'soon' })).toBe('')
	})
})
