/** The engine's emi-note plugin as the connector hands it over (`page.data.store.plugins.emiNote`). */
export type EmiNote = { active?: boolean; noCostMonths?: number; minPrice?: number }

/**
 * The line under a product's price about paying in EMIs, or null for none.
 *
 * It names a monthly amount only when the store said it has a no-cost offer for that many months:
 * the price over the months, rounded up to the rupee, so the shopper is never quoted less than the
 * gateway will charge. Without an offer it promises only that EMI can be chosen at checkout. Rupees
 * only, because the offers it describes are Indian card and bank EMIs. `price` is in major units,
 * as the page holds it; `minPrice` is in minor units.
 */
export function emiNoteText(note: EmiNote | null | undefined, price: unknown, currencyCode: string | null | undefined): string | null {
	if (!note?.active || currencyCode?.toUpperCase() !== 'INR') return null
	const minor = Math.round(Number(price) * 100)
	if (!Number.isFinite(minor) || minor <= 0) return null
	if (note.minPrice && minor < note.minPrice) return null
	const months = note.noCostMonths
	if (!months || !Number.isInteger(months) || months < 2) return 'EMI available at checkout'
	const rupees = Math.ceil(minor / (months * 100))
	return `No-cost EMI from ₹${new Intl.NumberFormat('en-IN').format(rupees)}/month`
}
