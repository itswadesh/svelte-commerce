/**
 * A product's size chart (GoCommerce D329): a row per size, a column per measurement, typed by
 * the shop in inches or centimetres. The connector sends it as `product.sizeChart`, the product's
 * own or else its category's; anything that is not a chart reads as none, and none draws nothing.
 */

export type SizeUnit = 'in' | 'cm'
export type SizeChart = { unit: SizeUnit; columns: string[]; rows: { size: string; values: string[] }[] }

const CM_PER_IN = 2.54

export function sizeChartOf(product: unknown): SizeChart | null {
	const c = (product as { sizeChart?: unknown } | null | undefined)?.sizeChart as Partial<SizeChart> | null | undefined
	if (!c || !Array.isArray(c.columns) || !Array.isArray(c.rows)) return null
	const columns = c.columns.map((x) => String(x ?? '').trim())
	const rows = c.rows
		.filter((r) => r && typeof r.size === 'string' && r.size.trim())
		.map((r) => ({ size: r.size.trim(), values: columns.map((_, i) => String(r.values?.[i] ?? '').trim()) }))
	if (!columns.length || !rows.length) return null
	return { unit: c.unit === 'cm' ? 'cm' : 'in', columns, rows }
}

/** A size's row, matched to an option value as a shopper would read it: case and spaces aside. */
export function rowFor(chart: SizeChart | null, size: string | null | undefined) {
	const want = String(size ?? '')
		.trim()
		.toLowerCase()
	if (!chart || !want) return null
	return chart.rows.find((r) => r.size.toLowerCase() === want) ?? null
}

/**
 * One value in another unit. Every number in it converts, so a range ("38-40") stays a range;
 * text with no number ("Free") is returned as typed. Inches round to the quarter a tape shows,
 * centimetres to a whole one past 10 and a tenth below.
 */
export function convertValue(value: string, from: SizeUnit, to: SizeUnit): string {
	if (from === to) return value
	return value.replace(/\d+(?:\.\d+)?/g, (n) => {
		const v = to === 'cm' ? Number(n) * CM_PER_IN : Number(n) / CM_PER_IN
		const rounded = to === 'in' ? Math.round(v * 4) / 4 : v >= 10 ? Math.round(v) : Math.round(v * 10) / 10
		return String(rounded)
	})
}

/** The chosen size's measurements in `unit`, blanks left out: [{ name: 'Chest', value: '40' }, …]. */
export function measurementsFor(chart: SizeChart | null, size: string | null | undefined, unit?: SizeUnit) {
	const row = rowFor(chart, size)
	if (!chart || !row) return []
	return chart.columns
		.map((name, i) => ({ name, value: convertValue(row.values[i] ?? '', chart.unit, unit ?? chart.unit) }))
		.filter((m) => m.name && m.value)
}
