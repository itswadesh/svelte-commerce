/**
 * The product page's and the address form's conversion helpers (GoCommerce D134): the sold
 * count's wording, when an option becomes a searchable picker, and how a PIN code fills the city
 * and state. Pure, so the rules are tested without a page.
 */

/**
 * "30+ sold", "45k+ sold". The engine has already counted real orders and rounded down; this only
 * words it. No count is no text, never "0 sold".
 */
export function soldLabel(n: number | null | undefined): string {
	if (typeof n !== 'number' || !Number.isFinite(n) || n <= 0) return ''
	if (n >= 1000) return `${Math.floor(n / 1000)}k+ sold`
	return `${Math.floor(n)}+ sold`
}

/**
 * Past this many values an option is a searchable picker rather than a wall of pills: hundreds of
 * phone models are unusable as buttons on a phone.
 */
export const PICKER_PILL_LIMIT = 12

export function usesSearchablePicker(values: unknown[] | null | undefined): boolean {
	return (values?.length ?? 0) > PICKER_PILL_LIMIT
}

export type PickerChoice = { id: string; value: string; selected: boolean; disabled: boolean }

/**
 * The values a picker offers, given each one's status from the cross-filter: a combination that
 * does not exist with what is already chosen is left out (a list of 300 with 280 struck through
 * helps nobody), and one that exists but cannot be bought stays, disabled, so the shopper learns
 * it is sold out rather than missing.
 */
export function pickerChoices(values: { id?: unknown; value: string }[], statusOf: (value: string) => string): PickerChoice[] {
	return values.flatMap((v) => {
		const status = statusOf(v.value)
		if (status === 'unavailable') return []
		return [{ id: String(v.id ?? v.value), value: v.value, selected: status === 'selected', disabled: status === 'soldout' }]
	})
}

/** India Post's PIN: six digits, the first a postal zone from 1 to 9. */
export function isIndianPin(country: string | null | undefined, zip: string | null | undefined): boolean {
	return (
		String(country ?? '')
			.trim()
			.toUpperCase() === 'IN' && /^[1-9][0-9]{5}$/.test(String(zip ?? '').trim())
	)
}

type Place = { city: string; state: string }

/**
 * What a PIN lookup may change: a field that is empty, or still holds what an earlier lookup put
 * there. Anything the shopper typed themselves stays theirs.
 */
export function pinAutofill(current: Partial<Place>, found: Place, lastFilled: Place | null): Partial<Place> {
	const out: Partial<Place> = {}
	for (const key of ['city', 'state'] as const) {
		const now = String(current[key] ?? '').trim()
		const ours = !now || (lastFilled != null && now === lastFilled[key])
		if (ours && found[key] && now !== found[key]) out[key] = found[key]
	}
	return out
}

/** The names an address can be saved under, as the address book shows them. */
export const ADDRESS_LABELS = ['Home', 'Work', 'Other'] as const

type OptionValueRef = { optionId: unknown; value: string }
type VariantLike = { options?: OptionValueRef[] | null }

/**
 * The variants that carry `value` for `optionId` and agree with what is chosen on the options
 * *before* it. Empty means that value does not exist with the earlier choices.
 *
 * Only the earlier ones, because options are chosen in order: "Brand" then "Model". Judging Brand
 * against the chosen model as well made every other brand "unavailable" once a model was picked
 * (no Samsung iPhone 15), so the brand could never change again; picking an earlier value now moves
 * the later ones to a combination that exists, which is what the variant lookup already does.
 */
export function variantsWith<V extends VariantLike>(
	variants: V[],
	options: { id: unknown }[],
	selection: [string, string][],
	optionId: unknown,
	value: string
): V[] {
	const same = (a: unknown, b: unknown) => String(a) === String(b)
	const position = (id: unknown) => options.findIndex((o) => same(o.id, id))
	const at = position(optionId)
	const earlier = selection.filter(([id]) => !same(id, optionId) && position(id) < at)
	return variants.filter((variant) => {
		const opts = variant?.options ?? []
		if (!opts.some((o) => same(o.optionId, optionId) && o.value === value)) return false
		return earlier.every(([id, v]) => opts.some((o) => same(o.optionId, id) && o.value === v))
	})
}

/**
 * The variant a choice lands on. It keeps every choice made on the options before this one, as
 * `variantsWith` promised when it offered the value; keeps the later choices too when that
 * combination exists; and otherwise moves the later ones to the first combination that can be
 * bought, then to any. The kit's own lookup falls back to the first variant with the value at all,
 * which could quietly change the size a shopper picked.
 */
export function variantFor<V extends VariantLike>(
	variants: V[],
	options: { id: unknown }[],
	selection: [string, string][],
	optionId: unknown,
	value: string,
	purchasable: (variant: V) => boolean
): V | null {
	const candidates = variantsWith(variants, options, selection, optionId, value)
	const same = (a: unknown, b: unknown) => String(a) === String(b)
	const others = selection.filter(([id]) => !same(id, optionId))
	const exact = candidates.find((variant) => others.every(([id, v]) => (variant.options ?? []).some((o) => same(o.optionId, id) && o.value === v)))
	return exact ?? candidates.find(purchasable) ?? candidates[0] ?? null
}
