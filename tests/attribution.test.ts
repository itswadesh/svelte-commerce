import { describe, expect, it } from 'vitest'
import { ATTRIBUTION_KEY, captureLanding, recordTouch, touchFrom, withoutAttribution } from '../src/lib/attribution'

const NOW = new Date('2026-10-30T10:00:00Z')
const days = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString()

function memory(init: Record<string, string> = {}) {
	const data = { ...init }
	return {
		data,
		getItem: (k: string) => data[k] ?? null,
		setItem: (k: string, v: string) => void (data[k] = v),
		removeItem: (k: string) => void delete data[k]
	}
}

describe('touchFrom', () => {
	it('reads the UTM parameters and click IDs of the landing address', () => {
		const url = new URL('https://shop.test/p/ring?utm_source=google&utm_medium=cpc&utm_campaign=Diwali&gclid=Cj0&size=7')
		expect(touchFrom(url, 'https://www.google.com/', NOW)).toEqual({
			utm_source: 'google',
			utm_medium: 'cpc',
			utm_campaign: 'Diwali',
			gclid: 'Cj0',
			referrer: 'www.google.com',
			at: NOW.toISOString()
		})
	})

	it('names another site by its domain alone, never its address', () => {
		expect(touchFrom(new URL('https://shop.test/'), 'https://blog.example/post?id=4&email=a@b.c', NOW)).toEqual({
			referrer: 'blog.example',
			at: NOW.toISOString()
		})
	})

	it('is nothing for a typed address, a page of the shop itself, or a return from payment', () => {
		expect(touchFrom(new URL('https://shop.test/'), '', NOW)).toBeNull()
		expect(touchFrom(new URL('https://shop.test/cart'), 'https://shop.test/p/ring', NOW)).toBeNull()
		expect(touchFrom(new URL('https://shop.test/checkout/success?order=1'), 'https://api.razorpay.com/', NOW)).toBeNull()
	})
})

describe('recordTouch', () => {
	it('keeps the first visit and moves the last', () => {
		const first = { utm_source: 'facebook', at: days(3) }
		const next = { utm_source: 'google', at: NOW.toISOString() }
		expect(recordTouch({ first, last: first }, next, NOW)).toEqual({ first, last: next })
	})

	it('starts again after 30 days, and a visit with no source changes nothing', () => {
		const old = { utm_source: 'facebook', at: days(31) }
		const next = { utm_source: 'google', at: NOW.toISOString() }
		expect(recordTouch({ first: old, last: old }, next, NOW)).toEqual({ first: next, last: next })
		const recent = { utm_source: 'google', at: days(2) }
		expect(recordTouch({ first: recent, last: recent }, null, NOW)).toEqual({ first: recent, last: recent })
		expect(recordTouch({ first: old, last: old }, null, NOW)).toBeNull()
	})
})

describe('captureLanding', () => {
	const landing = 'https://shop.test/?utm_source=google&utm_campaign=Diwali&fbclid=x&q=ring'

	it('records with the shopper’s leave for analytics', () => {
		const storage = memory({ user_consent: JSON.stringify({ analytics_storage: 'granted', ad_storage: 'denied' }) })
		captureLanding({ href: landing, referrer: '', storage, timeZone: 'Europe/Berlin', now: NOW })
		expect(JSON.parse(storage.data[ATTRIBUTION_KEY]).last.utm_campaign).toBe('Diwali')
	})

	it('records nothing, and forgets what it held, when analytics was refused', () => {
		const storage = memory({
			user_consent: JSON.stringify({ analytics_storage: 'denied' }),
			[ATTRIBUTION_KEY]: JSON.stringify({ last: { utm_source: 'x', at: days(1) } })
		})
		captureLanding({ href: landing, referrer: '', storage, timeZone: 'Asia/Kolkata', now: NOW })
		expect(storage.data[ATTRIBUTION_KEY]).toBeUndefined()
	})

	it('waits for an answer where the law asks first, and records where it does not', () => {
		const eu = memory()
		captureLanding({ href: landing, referrer: '', storage: eu, timeZone: 'Europe/Paris', now: NOW })
		expect(eu.data[ATTRIBUTION_KEY]).toBeUndefined()
		const india = memory()
		captureLanding({ href: landing, referrer: '', storage: india, timeZone: 'Asia/Kolkata', now: NOW })
		expect(india.data[ATTRIBUTION_KEY]).toBeDefined()
	})
})

describe('withoutAttribution', () => {
	it('takes the source parameters out of the address and leaves the rest', () => {
		expect(withoutAttribution('https://shop.test/p/ring?utm_source=google&size=7&gclid=Cj0#reviews')).toBe('https://shop.test/p/ring?size=7#reviews')
		expect(withoutAttribution('https://shop.test/?fbclid=x')).toBe('https://shop.test/')
		expect(withoutAttribution('https://shop.test/p/ring?size=7')).toBeNull()
	})
})

describe('review fixes', () => {
	it('keeps the last visit as the first when the first has gone stale', () => {
		const old = { utm_source: 'facebook', at: days(31) }
		const recent = { utm_source: 'google', at: days(10) }
		expect(recordTouch({ first: old, last: recent }, null, NOW)).toEqual({ first: recent, last: recent })
	})

	it('leaves out a value carrying an email address, and treats www as the shop itself', () => {
		const url = new URL('https://shop.test/?utm_source=newsletter&utm_term=a%40b.com')
		expect(touchFrom(url, '', NOW)).toEqual({ utm_source: 'newsletter', at: NOW.toISOString() })
		expect(touchFrom(new URL('https://shop.test/'), 'https://www.shop.test/p/ring', NOW)).toBeNull()
	})
})
