/**
 * "Ships from 18 Dec 2026" for a pre-order's day (GoCommerce D356), or '' when there is none.
 *
 * It is the merchant's stated date, so it is never worded as an arrival. Built from the parts
 * rather than `new Date('2026-12-18')`, which is midnight UTC and so the 17th for a shopper west
 * of Greenwich; and in one fixed locale so the server and the browser render the same text.
 */
export function shipsFromLabel(item: unknown): string {
	const day = (item as { shipsFrom?: unknown } | null | undefined)?.shipsFrom
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof day === 'string' ? day : '')
	if (!m) return ''
	const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
	return 'Ships from ' + date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
