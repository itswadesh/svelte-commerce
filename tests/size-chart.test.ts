import { describe, expect, it } from 'vitest'
import { convertValue, measurementsFor, rowFor, sizeChartOf } from '../src/lib/product/size-chart'

const chart = {
	unit: 'in' as const,
	columns: ['Chest', 'Length', 'Sleeve'],
	rows: [
		{ size: 'S', values: ['38', '27.5', ''] },
		{ size: 'M', values: ['40', '28', '8.25'] },
		{ size: 'XL', values: ['44-46', 'Free', '9'] }
	]
}

describe('size chart (GoCommerce D329)', () => {
	it('reads the connector field, and anything else is no chart', () => {
		expect(sizeChartOf({ sizeChart: chart })).toEqual(chart)
		expect(sizeChartOf({})).toBeNull()
		expect(sizeChartOf(null)).toBeNull()
		expect(sizeChartOf({ sizeChart: { unit: 'in', columns: [], rows: [] } })).toBeNull()
		expect(sizeChartOf({ sizeChart: { unit: 'in', columns: ['Chest'], rows: [{ size: ' ', values: ['1'] }] } })).toBeNull()
		expect(sizeChartOf({ sizeChart: { unit: 'x', columns: ['Chest'], rows: [{ size: 'M', values: [] }] } })).toEqual({
			unit: 'in',
			columns: ['Chest'],
			rows: [{ size: 'M', values: [''] }]
		})
	})

	it('matches an option value whatever its case', () => {
		expect(rowFor(chart, ' m ')?.values[0]).toBe('40')
		expect(rowFor(chart, 'XXL')).toBeNull()
		expect(rowFor(null, 'M')).toBeNull()
	})

	it('converts every number, ranges included, and leaves words alone', () => {
		expect(convertValue('40', 'in', 'cm')).toBe('102')
		expect(convertValue('44-46', 'in', 'cm')).toBe('112-117')
		expect(convertValue('102', 'cm', 'in')).toBe('40.25')
		expect(convertValue('2', 'in', 'cm')).toBe('5.1')
		expect(convertValue('Free', 'in', 'cm')).toBe('Free')
		expect(convertValue('40', 'in', 'in')).toBe('40')
	})

	it("gives the chosen size's measurements, blanks left out", () => {
		expect(measurementsFor(chart, 'M')).toEqual([
			{ name: 'Chest', value: '40' },
			{ name: 'Length', value: '28' },
			{ name: 'Sleeve', value: '8.25' }
		])
		expect(measurementsFor(chart, 'S').map((m) => m.name)).toEqual(['Chest', 'Length'])
		expect(measurementsFor(chart, 'M', 'cm')[0]).toEqual({ name: 'Chest', value: '102' })
		expect(measurementsFor(chart, 'XXL')).toEqual([])
		expect(measurementsFor(null, 'M')).toEqual([])
	})
})
