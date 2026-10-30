// Countries whose numbers keep their leading 0 after the country code (Italy, San Marino, the
// Vatican): there the 0 is part of the number, not a trunk prefix.
const KEEPS_ZERO = new Set(['39', '378', '379'])

/**
 * A phone number as typed, in the international form the engine wants: `+`, the country code,
 * the number. `dialCode` is the store's, such as `+91`, added when the number has none.
 *
 * At home a number is dialled with a trunk 0 (08895092508 in India), which is not part of the
 * international number: written after the country code it makes a different, wrong number. So
 * a leading 0 is dropped, `00` is read as the international `+`, and a number already carrying
 * the country code (with its `+` or without) keeps it.
 */
export function withDialCode(raw: string, dialCode: string): string {
	const typed = String(raw ?? '').trim()
	const code = String(dialCode ?? '').replace(/\D/g, '')
	let digits = typed.replace(/\D/g, '')
	if (!digits) return typed

	let international = typed.startsWith('+')
	if (!international && digits.startsWith('00')) {
		digits = digits.slice(2)
		international = true
	}
	if (!international) {
		if (!KEEPS_ZERO.has(code)) digits = digits.replace(/^0+/, '')
		// Ten digits after the country code is a whole number with its code already in front.
		if (!code || !(digits.startsWith(code) && digits.length >= code.length + 10)) {
			digits = code + digits
		}
	}
	// A trunk 0 typed after the country code: +91 0 88950 92508.
	if (code && !KEEPS_ZERO.has(code) && digits.startsWith(code + '0')) {
		digits = code + digits.slice(code.length).replace(/^0+/, '')
	}
	return '+' + digits
}
