// Where a shopper came from (GoCommerce D168): the link's UTM parameters, an ad platform's click ID
// and the referring site's domain, recorded when they arrive and kept in this browser for 30 days
// as the first visit with a source and the latest. The connector reads it at checkout and the
// order keeps it, so the store's ads report can say which campaign brought which order. It goes
// nowhere else.
//
// It follows the cookie banner's analytics choice (ad-tags.ts): recorded with the shopper's leave,
// not in an opt-in region before they answer, and forgotten when they refuse.

import { consentAllows } from '$lib/ad-tags'

export const ATTRIBUTION_KEY = 'gc_attribution'
const DAYS = 30
const MAX = 200

const PARAMS = [
	'utm_source',
	'utm_medium',
	'utm_campaign',
	'utm_content',
	'utm_term',
	'gclid',
	'gbraid',
	'wbraid',
	'fbclid',
	'ttclid',
	'msclkid'
] as const

export type Touch = Partial<Record<(typeof PARAMS)[number] | 'referrer' | 'at', string>>
export type Attribution = { first?: Touch; last?: Touch }

// Arriving here from a payment page is the end of a checkout, not a new visit: the gateway's
// domain would otherwise become the source of the shopper's next order.
const AFTER_PAYMENT = /^\/(checkout|payment|order)/

/** The arrival this address and referrer describe, or null when it names no source. */
export function touchFrom(url: URL, referrer: string, now: Date): Touch | null {
	const touch: Touch = {}
	for (const p of PARAMS) {
		const v = url.searchParams.get(p)?.trim()
		if (v) touch[p] = v.slice(0, MAX)
	}
	let host = ''
	try {
		host = referrer ? new URL(referrer).hostname : ''
	} catch {
		/* an unreadable referrer is none */
	}
	const tagged = Object.keys(touch).length > 0
	if (host && host !== url.hostname && (tagged || !AFTER_PAYMENT.test(url.pathname))) touch.referrer = host.slice(0, MAX)
	if (!Object.keys(touch).length) return null
	touch.at = now.toISOString()
	return touch
}

const fresh = (t: Touch | undefined, now: Date) => {
	const at = Date.parse(t?.at ?? '')
	return Number.isFinite(at) && now.getTime() - at <= DAYS * 86_400_000 ? t : undefined
}

/** The record after one arrival: the first visit kept while it is fresh, the last one moved. */
export function recordTouch(saved: Attribution | null, touch: Touch | null, now: Date): Attribution | null {
	const first = fresh(saved?.first, now) ?? touch ?? undefined
	const last = touch ?? fresh(saved?.last, now)
	if (!first && !last) return null
	return { ...(first ? { first } : {}), ...(last ? { last } : {}) }
}

type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem' | 'removeItem'>

/**
 * Records this arrival when the shopper's consent allows it, and forgets what was kept when it
 * does not. Storage that is blocked records nothing.
 */
export function captureLanding({
	href,
	referrer,
	storage,
	timeZone,
	now = new Date()
}: {
	href: string
	referrer: string
	storage: Storage
	timeZone: string
	now?: Date
}) {
	try {
		if (!consentAllows('analytics_storage', storage.getItem('user_consent'), timeZone)) {
			storage.removeItem(ATTRIBUTION_KEY)
			return
		}
		let saved: Attribution | null = null
		try {
			saved = JSON.parse(storage.getItem(ATTRIBUTION_KEY) || 'null')
		} catch {
			/* an unreadable record is none */
		}
		const next = recordTouch(saved, touchFrom(new URL(href), referrer, now), now)
		if (next) storage.setItem(ATTRIBUTION_KEY, JSON.stringify(next))
		else storage.removeItem(ATTRIBUTION_KEY)
	} catch {
		/* storage blocked: nothing is recorded */
	}
}

/** The address without its source parameters, or null when it has none. */
export function withoutAttribution(href: string): string | null {
	const url = new URL(href)
	const had = PARAMS.filter((p) => url.searchParams.has(p))
	if (!had.length) return null
	for (const p of had) url.searchParams.delete(p)
	return url.toString()
}
