import { withDialCode } from '$lib/utils/phone-number'

/**
 * What the contact page shows, worked out from the store record and nothing else. Every fact here
 * is one the store set; one it did not set comes back null and its card is not drawn.
 */

export type StoreAddress = { street?: string; city?: string; state?: string; pincode?: string; country?: string }
export type OpeningHours = { day: string; opens: string; closes: string }

/**
 * Whether a number without a country code is Indian: only when the store says it is in India
 * (GoCommerce publishes its country, D156). The store record's own `country` is the template
 * default (US) on an engine without one, so it is never asked, and nothing is guessed from the
 * currency: a number from a store whose country is unknown is shown and dialled as typed.
 */
export function inIndia(country: string | null | undefined): boolean {
	return String(country ?? '').toUpperCase() === 'IN'
}

/** `+91 98765 43210` for an Indian mobile (india.md); anything else as the store typed it. */
function display(international: string | null, typed: string): string {
	const m = international?.match(/^\+91([6-9]\d{9})$/)
	return m ? `+91 ${m[1].slice(0, 5)} ${m[1].slice(5)}` : typed
}

/**
 * The international form of a number, when it can be known: an Indian store's number gets +91,
 * and any number typed with its own `+` keeps it. Otherwise null — a number with no country code
 * from a store whose country is unknown is dialled as typed, never guessed at.
 */
function international(typed: string, india: boolean): string | null {
	if (india) return withDialCode(typed, '+91')
	return typed.startsWith('+') ? withDialCode(typed, '') : null
}

export function phoneLink(raw: unknown, india: boolean): { label: string; href: string } | null {
	const typed = String(raw ?? '').trim()
	if (!/\d{5}/.test(typed.replace(/\D/g, ''))) return null
	const intl = international(typed, india)
	return { label: display(intl, typed), href: 'tel:' + (intl ?? typed.replace(/[^\d+]/g, '')) }
}

/**
 * A wa.me link. The WhatsApp plugin asks for international digits (919876543210), so digits are
 * read as already carrying their country code — the same number the corner button dials — unless
 * they are a bare ten-digit Indian mobile on an Indian store, which gets its 91.
 */
export function whatsappLink(raw: unknown, india: boolean, text?: string): { label: string; href: string } | null {
	const typed = String(raw ?? '').trim()
	const digits = typed.replace(/\D/g, '')
	if (digits.length < 8) return null
	const mobile = india ? digits.match(/^0?([6-9]\d{9})$/) : null
	const intl = mobile ? '+91' + mobile[1] : '+' + digits
	const message = String(text ?? '').trim()
	return {
		label: display(intl, typed),
		href: `https://wa.me/${intl.slice(1)}${message ? `?text=${encodeURIComponent(message)}` : ''}`
	}
}

function countryName(code: string): string {
	try {
		return new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase()) ?? code
	} catch {
		return code
	}
}

/** The address as it is written on an envelope, one line each, empty parts skipped. */
export function addressLines(address: StoreAddress | null | undefined): string[] {
	if (!address) return []
	const place = [address.city, [address.state, address.pincode].filter(Boolean).join(' ')].filter(Boolean).join(', ')
	const lines = [address.street, place].map((l) => String(l ?? '').trim()).filter(Boolean)
	// A country alone is no address.
	if (!lines.length) return []
	if (address.country) lines.push(countryName(address.country))
	return lines
}

const DAYS: Array<[string, string, string]> = [
	['mon', 'Monday', 'https://schema.org/Monday'],
	['tue', 'Tuesday', 'https://schema.org/Tuesday'],
	['wed', 'Wednesday', 'https://schema.org/Wednesday'],
	['thu', 'Thursday', 'https://schema.org/Thursday'],
	['fri', 'Friday', 'https://schema.org/Friday'],
	['sat', 'Saturday', 'https://schema.org/Saturday'],
	['sun', 'Sunday', 'https://schema.org/Sunday']
]

/** `09:30` → `9:30 AM`, `19:00` → `7 PM`: the 12-hour clock Indian shoppers read (content.md). */
export function twelveHour(hhmm: string): string {
	const [h, m] = hhmm.split(':').map(Number)
	const hour = h % 12 || 12
	return `${hour}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'AM' : 'PM'}`
}

/**
 * The week as table rows, days with the same hours run together: "Monday to Saturday, 10 AM –
 * 7 PM", "Sunday, Closed". Once a store has given any hours, a day it left out is closed — that
 * is what leaving it out means in the panel. With none given there are no rows at all.
 */
export function hoursRows(hours: OpeningHours[] | null | undefined): Array<{ days: string; time: string }> {
	if (!hours?.length) return []
	const byDay = new Map(hours.map((h) => [h.day, h]))
	const rows: Array<{ first: string; last: string; time: string }> = []
	for (const [key, name] of DAYS) {
		const h = byDay.get(key)
		const time = h ? `${twelveHour(h.opens)} – ${twelveHour(h.closes)}` : 'Closed'
		const prev = rows.at(-1)
		if (prev && prev.time === time) prev.last = name
		else rows.push({ first: name, last: name, time })
	}
	return rows.map((r) => ({ days: r.first === r.last ? r.first : `${r.first} to ${r.last}`, time: r.time }))
}

/**
 * The page's JSON-LD: a ContactPage about the store, asserting only what it published. The hours
 * go on its ContactPoint (`hoursAvailable`), which every Organization type may carry, rather than
 * guessing the store is a LocalBusiness.
 */
export function contactPageSchema(args: {
	url: string
	origin: string
	name?: string
	schemaType?: string
	email?: string | null
	phone?: string | null
	address?: StoreAddress | null
	hours?: OpeningHours[] | null
}) {
	const { url, origin, name, email, phone, address, hours } = args
	const lines = addressLines(address)
	const point = {
		...(phone ? { telephone: phone } : {}),
		...(email ? { email } : {}),
		...(hours?.length
			? {
					hoursAvailable: hours.map((h) => ({
						'@type': 'OpeningHoursSpecification',
						dayOfWeek: DAYS.find(([key]) => key === h.day)?.[2],
						opens: h.opens,
						closes: h.closes
					}))
				}
			: {})
	}
	return {
		'@context': 'https://schema.org',
		'@type': 'ContactPage',
		url,
		...(name ? { name: `Contact ${name}` } : {}),
		about: {
			'@type': args.schemaType || 'Organization',
			'@id': `${origin}/#organization`,
			...(name ? { name } : {}),
			url: origin,
			...(lines.length && address
				? {
						address: {
							'@type': 'PostalAddress',
							...(address.street ? { streetAddress: address.street } : {}),
							...(address.city ? { addressLocality: address.city } : {}),
							...(address.state ? { addressRegion: address.state } : {}),
							...(address.pincode ? { postalCode: address.pincode } : {}),
							...(address.country ? { addressCountry: address.country.toUpperCase() } : {})
						}
					}
				: {}),
			...(Object.keys(point).length ? { contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', ...point } } : {})
		}
	}
}
