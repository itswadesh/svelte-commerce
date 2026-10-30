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

const EMBED_ORIGIN = 'https://www.google.com'
const COORDS = /^(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/

/**
 * The place a location names: typed coordinates, the pin in a place link (`!3d<lat>!4d<lng>`), or
 * the centre of a place link's view (`@lat,lng`). Only a place link's: in a search link the `@` is
 * wherever the map happened to be when it was copied, not anything the store chose.
 */
function coordsIn(location: string, url: URL | null): string | null {
	const pin = location.match(COORDS) ?? location.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/)
	const place = url && /^\/maps\/(place\/|@)/.test(url.pathname) ? location.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/) : null
	const pair = pin ?? place
	return pair ? `${pair[1]},${pair[2]}` : null
}

function httpsUrl(s: string): URL | null {
	try {
		const u = new URL(s)
		return u.protocol === 'https:' ? u : null
	} catch {
		return null
	}
}

/**
 * Where the map comes from, and where "Open in Google Maps" goes.
 *
 * The store's own map location wins over its address, because it exists to correct a pin the
 * address puts in the wrong place: an "Embed a map" link is framed as it is, coordinates (typed,
 * or read out of a place link) are framed as a pin, and a link with neither (a share link, a
 * Business Profile) is opened but draws no map — a map of the address would be the very pin the
 * store set it to correct. With no location, the address is both. Every frame is on
 * www.google.com and nowhere else, so a country domain's embed link is moved there (same path,
 * same map). `embed` is null when there is nothing to draw; the link may still be there.
 */
export function mapFor(location: unknown, addressQuery: string): { embed: string | null; open: string } | null {
	const loc = String(location ?? '').trim()
	const search = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
	const frame = (q: string) => `${EMBED_ORIGIN}/maps?q=${encodeURIComponent(q)}&output=embed`
	const url = loc ? httpsUrl(loc) : null
	if (url && url.pathname.startsWith('/maps/embed')) {
		const embed = EMBED_ORIGIN + url.pathname + url.search
		const coords = coordsIn(loc.replace(/!2d(-?[\d.]+)!3d(-?[\d.]+)/, '!3d$2!4d$1'), url)
		const q = coords ?? addressQuery
		return { embed, open: q ? search(q) : embed }
	}
	const coords = loc ? coordsIn(loc, url) : null
	if (coords) return { embed: frame(coords), open: url ? loc : search(coords) }
	if (url) return { embed: null, open: loc }
	if (addressQuery) return { embed: frame(addressQuery), open: search(addressQuery) }
	return null
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
