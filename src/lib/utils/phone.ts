/**
 * A phone number as typed, made into the digits a phone rule checks: spaces, dashes, dots and
 * brackets go, a leading + stays, and an 11-digit number's leading 0 (the trunk prefix Indian
 * numbers are often written with) goes. "+91 98765 01234", "98765-01234" and "098765 01234" were
 * refused at checkout as invalid, and browser autofill inserts those spaces itself.
 */
export function tidyPhone(raw: unknown): string {
	const text = String(raw ?? '').trim()
	if (!text) return ''
	const plus = text.startsWith('+')
	let digits = text.replace(/\D/g, '')
	if (!plus && digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
	return (plus ? '+' : '') + digits
}
