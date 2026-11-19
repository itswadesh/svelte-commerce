/**
 * The product page's PIN code check on a GoCommerce store (D286): the shopper types a PIN and the
 * engine says whether the store delivers there and roughly when. These are the pieces worth
 * testing without a page — what counts as a postcode, and the sentence the answer becomes.
 */

export type DeliveryAnswer = {
	postcode: string
	city: string
	deliverable: boolean
	unknownPostcode?: boolean
	minDays: number | null
	maxDays: number | null
}

/** Six digits not starting with 0 in India, as India Post issues them; 3–10 letters or digits elsewhere. */
export function validPostcode(country: string, postcode: string): boolean {
	const code = String(postcode ?? '').trim()
	if (String(country ?? '').toUpperCase() === 'IN') return /^[1-9][0-9]{5}$/.test(code)
	return /^[A-Za-z0-9]{3,10}$/.test(code.replace(/\s+/g, ''))
}

/** What the shopper reads: where it delivers and in how many days, as far as the store has said. */
export function deliveryMessage(a: DeliveryAnswer): string {
	if (!a.deliverable) return 'Sorry, delivery is not available at your PIN code.'
	const place = a.city || a.postcode
	const lo = a.minDays ?? a.maxDays
	const hi = a.maxDays ?? a.minDays
	if (lo == null || hi == null) return `Delivers to ${place}`
	if (lo === hi) return `Delivers to ${place} in ${lo} ${lo === 1 ? 'day' : 'days'}`
	return `Delivers to ${place} in ${lo}–${hi} days`
}
