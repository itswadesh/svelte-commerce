import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { consentAllows, enabledTags, startAdTags, vendorCalls } from '$lib/ad-tags'

const ALL = {
	facebookPixel: { active: true, id: '1234567890' },
	microsoftClarity: { active: true, id: 'abcd1234ef' },
	hotjar: { active: true, id: '3712345' },
	tiktokPixel: { active: true, id: 'C4ABCDEF12' },
	pinterestTag: { active: true, id: '2612345678901' },
	snapchatPixel: { active: true, id: '6abc82ca-4a3a-4391-98ba-0317a8471234' }
}
// What the connector makes of the engine's google-analytics plugin.
const GOOGLE = { active: true, tags: ['G-ABC123XYZ', 'AW-1234567890'], conversions: [{ event: 'purchase', label: 'AbC-dEf_1' }] }

describe('enabledTags', () => {
	it('loads nothing for a store with every tag off or unset', () => {
		expect(enabledTags(undefined)).toEqual({})
		expect(enabledTags({})).toEqual({})
		expect(enabledTags({ facebookPixel: { active: false, id: '1234567890' }, hotjar: { active: true, id: '' } })).toEqual({})
	})

	it('takes each tag the store switched on with an ID shaped like that vendor’s', () => {
		expect(enabledTags(ALL)).toEqual({
			meta: '1234567890',
			clarity: 'abcd1234ef',
			hotjar: '3712345',
			tiktok: 'C4ABCDEF12',
			pinterest: '2612345678901',
			snap: '6abc82ca-4a3a-4391-98ba-0317a8471234'
		})
	})

	it('refuses an ID that would break out of the script it goes into', () => {
		expect(enabledTags({ facebookPixel: { active: true, id: "1'); alert(1); ('" } })).toEqual({})
		expect(enabledTags({ microsoftClarity: { active: true, id: 'abc"><script>' } })).toEqual({})
		expect(enabledTags({ googleTagManager: { active: true, tags: ["G-ABC'+alert(1)+'"] } })).toEqual({})
		expect(enabledTags({ googleTagManager: { ...GOOGLE, conversions: [{ event: 'purchase', label: "x'/><script>" }] } })).toEqual({
			ga4: 'G-ABC123XYZ',
			gads: 'AW-1234567890'
		})
	})

	it('reads Google Analytics and Ads from googleTagManager, with the purchase’s conversion label', () => {
		expect(enabledTags({ googleTagManager: GOOGLE })).toEqual({ ga4: 'G-ABC123XYZ', gads: 'AW-1234567890/AbC-dEf_1' })
		// Ads without a label has no conversion to send, but still measures.
		expect(enabledTags({ googleTagManager: { active: true, tags: ['AW-1234567890'] } })).toEqual({ gads: 'AW-1234567890' })
		// The Litekart-era single id.
		expect(enabledTags({ googleTagManager: { active: true, id: 'G-ABC123XYZ' } })).toEqual({ ga4: 'G-ABC123XYZ' })
		expect(enabledTags({ googleTagManager: { ...GOOGLE, active: false } })).toEqual({})
		expect(enabledTags({ googleTagManager: { active: false } })).toEqual({})
	})

	it('a Tag Manager container takes over Analytics and Ads, so nothing is measured twice', () => {
		expect(enabledTags({ googleTagManager: { ...GOOGLE, tags: [...GOOGLE.tags, 'GTM-K9ZZ1'] } })).toEqual({ gtm: 'GTM-K9ZZ1' })
	})
})

describe('consentAllows', () => {
	const granted = JSON.stringify({ ad_storage: 'granted', analytics_storage: 'granted' })
	const adsDenied = JSON.stringify({ ad_storage: 'denied', analytics_storage: 'granted' })

	it('a saved choice decides, per kind', () => {
		expect(consentAllows('ad_storage', adsDenied, 'Asia/Kolkata')).toBe(false)
		expect(consentAllows('analytics_storage', adsDenied, 'Asia/Kolkata')).toBe(true)
		expect(consentAllows('ad_storage', granted, 'Europe/Berlin')).toBe(true)
	})

	it('without one, opt-in regions wait and the rest may load', () => {
		expect(consentAllows('ad_storage', null, 'Europe/Berlin')).toBe(false)
		expect(consentAllows('analytics_storage', null, 'Europe/London')).toBe(false)
		expect(consentAllows('ad_storage', null, 'Asia/Kolkata')).toBe(true)
		expect(consentAllows('ad_storage', 'not json', 'America/New_York')).toBe(true)
	})

	it('a zone that says nothing, and the EU outside Europe/, wait as well', () => {
		for (const zone of [
			'',
			'UTC',
			'Etc/GMT',
			'Asia/Nicosia',
			'Asia/Famagusta',
			'Africa/Ceuta',
			'Indian/Reunion',
			'America/Martinique',
			'Atlantic/Canary'
		]) {
			expect(consentAllows('ad_storage', null, zone), zone).toBe(false)
		}
		for (const zone of ['Asia/Kolkata', 'America/New_York', 'Asia/Dubai', 'Australia/Sydney']) {
			expect(consentAllows('ad_storage', null, zone), zone).toBe(true)
		}
	})
})

describe('vendorCalls', () => {
	const tags = ['meta', 'tiktok', 'pinterest', 'snap', 'clarity', 'hotjar'] as const
	const item = { item_id: 'TEE-M', price: 499, quantity: 2 }

	it('a product view is each vendor’s own name for it, with value and currency', () => {
		expect(vendorCalls('view_item', { currency: 'INR', value: 499, items: [{ ...item, quantity: 1 }] }, [...tags])).toEqual([
			[
				'meta',
				'track',
				'ViewContent',
				{ content_ids: ['TEE-M'], content_type: 'product', contents: [{ id: 'TEE-M', quantity: 1 }], currency: 'INR', value: 499 }
			],
			[
				'tiktok',
				'track',
				'ViewContent',
				{ contents: [{ content_id: 'TEE-M', content_type: 'product', quantity: 1, price: 499 }], currency: 'INR', value: 499 }
			],
			[
				'pinterest',
				'track',
				'pagevisit',
				{ line_items: [{ product_id: 'TEE-M', product_price: 499, product_quantity: 1 }], currency: 'INR', value: 499 }
			],
			['snap', 'track', 'VIEW_CONTENT', { item_ids: ['TEE-M'], price: 499, currency: 'INR' }]
		])
	})

	it('reads core’s view_item, whose items is one object rather than a list', () => {
		const [meta] = vendorCalls('view_item', { currency: 'INR', value: 499, items: { item_id: 'TEE-M', price: 499 } }, ['meta'])
		expect(meta[3]).toMatchObject({ content_ids: ['TEE-M'], contents: [{ id: 'TEE-M', quantity: 1 }] })
	})

	it('add to cart and checkout carry the units', () => {
		const add = vendorCalls('add_to_cart', { currency: 'INR', value: 998, items: [item] }, [...tags])
		expect(add.map((c) => c.slice(0, 3))).toEqual([
			['meta', 'track', 'AddToCart'],
			['tiktok', 'track', 'AddToCart'],
			['pinterest', 'track', 'addtocart'],
			['snap', 'track', 'ADD_CART']
		])
		expect(add[2][3]).toMatchObject({ value: 998, currency: 'INR', order_quantity: 2 })
		expect(add[3][3]).toMatchObject({ price: 998, number_items: 2 })

		const begin = vendorCalls('begin_checkout', { currency: 'INR', value: 998, items: [item] }, [...tags])
		// Pinterest has no event for starting a checkout; its "checkout" is the purchase.
		expect(begin.map((c) => c.slice(0, 3))).toEqual([
			['meta', 'track', 'InitiateCheckout'],
			['tiktok', 'track', 'InitiateCheckout'],
			['snap', 'track', 'START_CHECKOUT']
		])
		expect(begin[0][3]).toMatchObject({ num_items: 2, value: 998, currency: 'INR' })
	})

	it('a purchase carries the order number, as the Meta eventID the server sends too', () => {
		const calls = vendorCalls('purchase', { transaction_id: 'GC-1001', currency: 'INR', value: 1047, items: [item] }, [...tags])
		expect(calls[0]).toEqual([
			'meta',
			'track',
			'Purchase',
			{ content_ids: ['TEE-M'], content_type: 'product', contents: [{ id: 'TEE-M', quantity: 2 }], currency: 'INR', value: 1047, num_items: 2 },
			{ eventID: 'GC-1001' }
		])
		expect(calls[1].slice(0, 3)).toEqual(['tiktok', 'track', 'Purchase'])
		expect(calls[2]).toEqual([
			'pinterest',
			'track',
			'checkout',
			{
				line_items: [{ product_id: 'TEE-M', product_price: 499, product_quantity: 2 }],
				currency: 'INR',
				value: 1047,
				order_quantity: 2,
				order_id: 'GC-1001'
			}
		])
		expect(calls[3][3]).toMatchObject({ transaction_id: 'GC-1001', price: 1047, currency: 'INR' })
	})

	it('hands on nothing it was not given: no personal data, no other events', () => {
		const calls = vendorCalls(
			'purchase',
			{ transaction_id: 'GC-1', currency: 'INR', value: 10, items: [item], hashedEmail: 'abc', user_agent: 'x', iPv4: '1.2.3.4' } as any,
			[...tags]
		)
		expect(JSON.stringify(calls)).not.toMatch(/hashedEmail|abc|user_agent|1\.2\.3\.4/)
		expect(vendorCalls('remove_from_cart', { items: [item] }, [...tags])).toEqual([])
		expect(vendorCalls('login', {}, [...tags])).toEqual([])
	})

	it('GA4 hears every event, to GA4 alone, with its e-commerce parameters and nothing personal', () => {
		const purchase = { transaction_id: 'GC-1', currency: 'INR', value: 10, items: [item] }
		const personal = { hashedEmail: 'abc', hashedPhone: 'def', iPv4: '1.2.3.4', iPv6: '::1', user_agent: 'x', city: 'Pune', zip: '411001', vendor_email: 'v@x.in' }
		expect(vendorCalls('purchase', { ...purchase, ...personal } as any, ['ga4'])).toEqual([['ga4', 'event', 'purchase', purchase]])
		expect(vendorCalls('search', { search_term: 'tee' } as any, ['ga4'], { ga4: 'G-ABC123XYZ' })).toEqual([
			['ga4', 'event', 'search', { search_term: 'tee', send_to: 'G-ABC123XYZ' }]
		])
		// Core's sign-out hands GA4 the whole user record; an event never picks its own destination.
		const user = { id: 'u1', fullName: 'Asha Rao', email: 'asha@example.com', phone: '+919876543210', send_to: 'AW-1234567890' }
		expect(vendorCalls('logout', user as any, ['ga4'])).toEqual([['ga4', 'event', 'logout', {}]])
	})

	it('Tag Manager gets each event in the shape Google’s e-commerce guide gives it', () => {
		const add = { currency: 'INR', value: 998, items: [item] }
		expect(vendorCalls('add_to_cart', { ...add, iPv4: '1.2.3.4' } as any, ['gtm'])).toEqual([['gtm', { event: 'add_to_cart', ecommerce: add }]])
	})

	it('a purchase is the Google Ads conversion, when the store gave its label', () => {
		const purchase = { transaction_id: 'GC-1', currency: 'INR', value: 1047, items: [item] }
		expect(vendorCalls('purchase', purchase, ['gads'], { gads: 'AW-1234567890/AbC-dEf_1' })).toEqual([
			['gads', 'event', 'conversion', { send_to: 'AW-1234567890/AbC-dEf_1', value: 1047, currency: 'INR', transaction_id: 'GC-1' }]
		])
		expect(vendorCalls('purchase', purchase, ['gads'], { gads: 'AW-1234567890' })).toEqual([])
		expect(vendorCalls('add_to_cart', purchase, ['gads'], { gads: 'AW-1234567890/AbC-dEf_1' })).toEqual([])
	})
})

describe('startAdTags', () => {
	const w = window as any
	let stop: (() => void) | undefined

	const scripts = () => [...document.querySelectorAll('script[src]')].map((s) => (s as HTMLScriptElement).src)
	// The vendor snippets are imported when a tag first loads.
	const settle = async () => {
		await vi.dynamicImportSettled()
		await new Promise((r) => setTimeout(r, 0))
	}
	const interact = async () => {
		window.dispatchEvent(new Event('pointerdown'))
		await settle()
	}
	const choose = async (detail: Record<string, string>) => {
		window.dispatchEvent(new CustomEvent('consentchange', { detail }))
		await settle()
	}
	const metaCalls = () => w.fbq.queue.map((a: IArguments) => [...a])
	const view = (id: string) => ({ currency: 'INR', value: 499, items: [{ item_id: id, price: 499, quantity: 1 }] })

	const google = () => scripts().filter((src) => src.includes('google'))
	// Each command the Google tag got, with the date of 'js' left out.
	const gcCalls = () => (w.gcLayer ?? []).map((a: IArguments) => [...a]).map((c: unknown[]) => (c[0] === 'js' ? ['js'] : c))
	const purchase = { transaction_id: 'GC-7', currency: 'INR', value: 549, items: [{ item_id: 'TEE-M', price: 499, quantity: 1 }] }

	beforeEach(() => {
		document.head.innerHTML = '<script></script>'
		localStorage.clear()
		history.replaceState(null, '', '/')
		for (const k of ['fbq', '_fbq', 'ttq', 'TiktokAnalyticsObject', 'pintrk', 'snaptr', 'clarity', 'hj', '_hjSettings', 'gcLayer', 'gcGtag', 'gtmLayer', 'gtmGtag', 'ga-disable-G-ABC123XYZ', 'ga-disable-AW-1234567890']) delete w[k]
		w.dataLayer = []
		w.gtag = function () {
			w.dataLayer.push(arguments)
		}
	})
	afterEach(() => stop?.())

	it('loads nothing until the shopper first interacts, then each tag once', async () => {
		stop = startAdTags(enabledTags(ALL), { timeZone: 'Asia/Kolkata' }).stop
		expect(scripts()).toEqual([])
		await interact()
		await interact()
		const loaded = scripts()
		expect(loaded).toHaveLength(6)
		for (const host of [
			'connect.facebook.net',
			'www.clarity.ms/tag/abcd1234ef',
			'static.hotjar.com/c/hotjar-3712345',
			'analytics.tiktok.com',
			's.pinimg.com',
			'sc-static.net'
		]) {
			expect(
				loaded.some((src) => src.includes(host)),
				host
			).toBe(true)
		}
		expect(metaCalls()).toEqual([
			['init', '1234567890'],
			['track', 'PageView']
		])
		// Meta's own history tracking is off; page views are sent once the new page is in place.
		expect(w.fbq.disablePushState).toBe(true)
	})

	it('a store with nothing switched on loads nothing and leaves gtag alone', async () => {
		const gtag = w.gtag
		stop = startAdTags({}, { timeZone: 'Asia/Kolkata' }).stop
		await interact()
		expect(scripts()).toEqual([])
		expect(w.gtag).toBe(gtag)
	})

	it('hears the GA4 events, including those sent before it started, and keeps GA4 getting them', async () => {
		w.gtag('event', 'view_item', view('TEE-M'))
		stop = startAdTags({ meta: '1234567890' }, { timeZone: 'Asia/Kolkata' }).stop
		w.gtag('event', 'add_to_cart', view('TEE-M'))
		await interact()
		w.gtag('event', 'purchase', { transaction_id: 'GC-7', currency: 'INR', value: 549, items: [{ item_id: 'TEE-M', price: 499, quantity: 1 }] })
		const sent = metaCalls()
		expect(sent.map((a: unknown[]) => a.slice(0, 2))).toEqual([
			['init', '1234567890'],
			['track', 'PageView'],
			['track', 'ViewContent'],
			['track', 'AddToCart'],
			['track', 'Purchase']
		])
		expect(sent[4][3]).toEqual({ eventID: 'GC-7' })
		expect(w.dataLayer.filter((a: IArguments) => a[0] === 'event').map((a: IArguments) => a[1])).toEqual(['view_item', 'add_to_cart', 'purchase'])
	})

	it('keeps hearing GA4 after the Google loader replaces gtag with its own', async () => {
		stop = startAdTags({ meta: '1234567890' }, { timeZone: 'Asia/Kolkata' }).stop
		// What GoogleAnalytics' inline config script does when it starts.
		w.gtag = function () {
			w.dataLayer.push(arguments)
		}
		w.gtag('event', 'add_to_cart', view('TEE-M'))
		await interact()
		w.gtag('event', 'begin_checkout', view('TEE-M'))
		expect(metaCalls().map((a: unknown[]) => a[1])).toEqual(['1234567890', 'PageView', 'AddToCart', 'InitiateCheckout'])
	})

	it('counts a product view once, though the page and core both report it, and a later view again', async () => {
		stop = startAdTags({ snap: '6abc82ca-4a3a-4391-98ba-0317a8471234' }, { timeZone: 'Asia/Kolkata' }).stop
		await interact()
		w.gtag('event', 'view_item', view('TEE-M'))
		w.gtag('event', 'view_item', { currency: 'INR', value: 499, items: { item_id: 'TEE-M', price: 499 } })
		w.gtag('event', 'view_item', view('MUG-1'))
		const views = w.snaptr.queue.map((a: IArguments) => [...a]).filter((a: unknown[]) => a[1] === 'VIEW_CONTENT')
		expect(views.map((a: any[]) => a[2].item_ids[0])).toEqual(['TEE-M', 'MUG-1'])
	})

	it('waits for consent where it is needed, and a choice in the banner loads what it allows', async () => {
		stop = startAdTags(enabledTags(ALL), { timeZone: 'Europe/Berlin' }).stop
		w.gtag('event', 'view_item', view('TEE-M'))
		await interact()
		expect(scripts()).toEqual([])
		await choose({ ad_storage: 'granted', analytics_storage: 'granted' })
		expect(scripts()).toHaveLength(6)
		// What happened before the shopper chose is not handed on.
		expect(metaCalls().map((a: unknown[]) => a[1])).toEqual(['1234567890', 'PageView'])
	})

	it('a saved refusal keeps the ad pixels out everywhere', async () => {
		localStorage.setItem('user_consent', JSON.stringify({ ad_storage: 'denied', analytics_storage: 'denied' }))
		stop = startAdTags(enabledTags(ALL), { timeZone: 'Asia/Kolkata' }).stop
		await interact()
		expect(scripts()).toEqual([])
	})

	it('a choice taken back starts the page again, since a running tag cannot be unloaded', async () => {
		const reload = vi.fn()
		stop = startAdTags(enabledTags(ALL), { timeZone: 'Asia/Kolkata', reload }).stop
		await interact()
		await choose({ ad_storage: 'granted', analytics_storage: 'granted' })
		expect(reload).not.toHaveBeenCalled()
		await choose({ ad_storage: 'denied', analytics_storage: 'denied' })
		expect(reload).toHaveBeenCalledOnce()
	})

	it('a purchase loads the tags at once: the page a gateway returns to may never be touched', async () => {
		stop = startAdTags({ meta: '1234567890' }, { timeZone: 'Asia/Kolkata' }).stop
		w.gtag('event', 'purchase', { transaction_id: 'GC-9', currency: 'INR', value: 549, items: [{ item_id: 'TEE-M', price: 499, quantity: 1 }] })
		await settle()
		expect(metaCalls().find((a: unknown[]) => a[1] === 'Purchase')?.[3]).toEqual({ eventID: 'GC-9' })
		// Loading scans the dataLayer again; the purchase that started it is still one purchase.
		expect(metaCalls().filter((a: unknown[]) => a[1] === 'Purchase')).toHaveLength(1)
	})

	it('loads nothing while the address carries an email, a token or a key, and loads once it does not', async () => {
		history.replaceState(null, '', '/auth/verify?email=a%40example.com&token=t0k')
		const tags = startAdTags(enabledTags(ALL), { timeZone: 'Asia/Kolkata' })
		stop = tags.stop
		await interact()
		expect(scripts()).toEqual([])
		history.replaceState(null, '', '/account')
		tags.pageView()
		await settle()
		expect(scripts()).toHaveLength(6)
		// Nor is a page view sent for such an address after the tags are running.
		history.replaceState(null, '', '/order-tracking?order=GC-1&key=abc')
		tags.pageView()
		expect(metaCalls().filter((a: unknown[]) => a[1] === 'PageView')).toHaveLength(1)
	})

	it('Google Analytics and Ads load on the first interaction, on a data layer of their own, after the page’s consent', async () => {
		w.gtag('consent', 'default', { ad_storage: 'granted', analytics_storage: 'granted' })
		w.gtag('event', 'view_item', view('TEE-M'))
		stop = startAdTags(enabledTags({ googleTagManager: GOOGLE }), { timeZone: 'Asia/Kolkata' }).stop
		expect(google()).toEqual([])
		await interact()
		expect(google()).toEqual(['https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ&l=gcLayer'])
		w.gtag('event', 'purchase', { ...purchase, hashedEmail: 'abc' })
		expect(gcCalls()).toEqual([
			['consent', 'default', { ad_storage: 'granted', analytics_storage: 'granted' }],
			['js'],
			['config', 'G-ABC123XYZ'],
			['config', 'AW-1234567890'],
			['event', 'view_item', { ...view('TEE-M'), send_to: 'G-ABC123XYZ' }],
			['event', 'purchase', { ...purchase, send_to: 'G-ABC123XYZ' }],
			['event', 'conversion', { send_to: 'AW-1234567890/AbC-dEf_1', value: 549, currency: 'INR', transaction_id: 'GC-7' }]
		])
		// The page's own dataLayer is untouched: core's events are there once, as sent.
		expect(w.dataLayer.filter((a: IArguments) => a[0] === 'event').map((a: IArguments) => a[1])).toEqual(['view_item', 'purchase'])
	})

	it('in an opt-in region Google waits, and Analytics consent alone loads Analytics but not Ads', async () => {
		stop = startAdTags(enabledTags({ googleTagManager: GOOGLE }), { timeZone: 'Europe/Berlin' }).stop
		w.gtag('event', 'view_item', view('TEE-M'))
		await interact()
		expect(google()).toEqual([])
		// What the banner does: Google's consent update, then the choice for the other tags.
		const choice = { ad_storage: 'denied', analytics_storage: 'granted' }
		w.gtag('consent', 'update', choice)
		await choose(choice)
		expect(google()).toHaveLength(1)
		w.gtag('event', 'purchase', purchase)
		const sent = gcCalls()
		expect(sent).toContainEqual(['consent', 'update', choice])
		expect(sent.filter((c: unknown[]) => c[0] === 'config')).toEqual([['config', 'G-ABC123XYZ']])
		// Nothing from before the choice, and no Ads conversion.
		expect(sent.filter((c: unknown[]) => c[0] === 'event').map((c: unknown[]) => c[1])).toEqual(['purchase'])
	})

	it('a later choice reaches the running Google tag as a consent update, and taking it back reloads', async () => {
		const reload = vi.fn()
		stop = startAdTags(enabledTags({ googleTagManager: GOOGLE }), { timeZone: 'Asia/Kolkata', reload }).stop
		await interact()
		const choice = { ad_storage: 'denied', analytics_storage: 'denied' }
		w.gtag('consent', 'update', choice)
		expect(gcCalls().at(-1)).toEqual(['consent', 'update', choice])
		await choose(choice)
		expect(reload).toHaveBeenCalledOnce()
		// Google's opt-out flags, so nothing more is sent as the page goes.
		expect(w['ga-disable-G-ABC123XYZ']).toBe(true)
		expect(w['ga-disable-AW-1234567890']).toBe(true)
	})

	it('a store with Google off, or a saved refusal, makes no Google request at all', async () => {
		stop = startAdTags(enabledTags({ ...ALL, googleTagManager: { active: false } }), { timeZone: 'Asia/Kolkata' }).stop
		await interact()
		w.gtag('event', 'purchase', purchase)
		expect(google()).toEqual([])
		expect(w.gcLayer).toBeUndefined()
		stop()

		// Another page.
		w.dataLayer = []
		localStorage.setItem('user_consent', JSON.stringify({ ad_storage: 'denied', analytics_storage: 'denied' }))
		stop = startAdTags(enabledTags({ googleTagManager: GOOGLE }), { timeZone: 'Asia/Kolkata' }).stop
		await interact()
		w.gtag('event', 'purchase', purchase)
		expect(google()).toEqual([])
	})

	it('Google neither loads nor hears an event while the address carries an email, a token or a key', async () => {
		history.replaceState(null, '', '/auth/verify?email=a%40example.com&token=t0k')
		const tags = startAdTags(enabledTags({ googleTagManager: GOOGLE }), { timeZone: 'Asia/Kolkata' })
		stop = tags.stop
		await interact()
		expect(google()).toEqual([])
		history.replaceState(null, '', '/account')
		tags.pageView()
		await settle()
		expect(google()).toHaveLength(1)
		history.replaceState(null, '', '/order-tracking?order=GC-1&key=abc')
		w.gtag('event', 'view_item', view('TEE-M'))
		expect(gcCalls().filter((c: unknown[]) => c[0] === 'event')).toEqual([])
	})

	it('a Tag Manager container loads on a layer of its own: the consent first, then only what is handed on', async () => {
		w.gtag('consent', 'default', { ad_storage: 'granted', analytics_storage: 'granted' })
		stop = startAdTags(enabledTags({ googleTagManager: { ...GOOGLE, tags: [...GOOGLE.tags, 'GTM-K9ZZ1'] } }), { timeZone: 'Asia/Kolkata' }).stop
		w.gtag('event', 'add_to_cart', view('TEE-M'))
		await interact()
		expect(google()).toEqual(['https://www.googletagmanager.com/gtm.js?id=GTM-K9ZZ1&l=gtmLayer'])
		w.gtag('event', 'purchase', { ...purchase, hashedEmail: 'abc' })
		w.gtag('consent', 'update', { ad_storage: 'denied' })
		const layer = w.gtmLayer.map((m: any) => (m && typeof m === 'object' && 0 in m ? [...m] : m.event ?? m))
		expect(layer).toEqual([
			['consent', 'default', { ad_storage: 'granted', analytics_storage: 'granted' }],
			'gtm.js',
			{ ecommerce: null },
			'add_to_cart',
			{ ecommerce: null },
			'purchase',
			['consent', 'update', { ad_storage: 'denied' }]
		])
		expect(w.gtmLayer.find((m: any) => m.event === 'purchase')).toEqual({ event: 'purchase', ecommerce: purchase })
		// The page's dataLayer gets nothing from the bridge, and core's commands never reach the container.
		expect(w.dataLayer.every((m: unknown) => m && typeof m === 'object' && 0 in m)).toBe(true)
		expect(w.gcLayer).toBeUndefined()
	})

	it('a choice made while the tags are on their way is the one that stands', async () => {
		stop = startAdTags(enabledTags({ ...ALL, googleTagManager: GOOGLE }), { timeZone: 'Asia/Kolkata' }).stop
		// The first tap starts loading; "Required only" comes before the snippets have arrived.
		window.dispatchEvent(new Event('pointerdown'))
		window.dispatchEvent(new CustomEvent('consentchange', { detail: { ad_storage: 'denied', analytics_storage: 'denied' } }))
		await settle()
		expect(scripts()).toEqual([])
	})

	it('started again on the same page, the bridge neither hears an old purchase again nor loads a tag twice', async () => {
		stop = startAdTags({ meta: '1234567890' }, { timeZone: 'Asia/Kolkata' }).stop
		await interact()
		w.gtag('event', 'purchase', purchase)
		stop()
		stop = startAdTags({ meta: '1234567890' }, { timeZone: 'Asia/Kolkata' }).stop
		await interact()
		w.gtag('event', 'add_to_cart', view('TEE-M'))
		expect(metaCalls().map((a: unknown[]) => a[1])).toEqual(['1234567890', 'PageView', 'Purchase', 'AddToCart'])
	})

	it('a tag the store dropped while the page was open is turned off, by the ID it loaded with', async () => {
		const reload = vi.fn()
		stop = startAdTags(enabledTags({ googleTagManager: GOOGLE }), { timeZone: 'Asia/Kolkata', reload }).stop
		await interact()
		stop()
		// The store added a container, which takes over GA4 and Ads.
		stop = startAdTags(enabledTags({ googleTagManager: { ...GOOGLE, tags: [...GOOGLE.tags, 'GTM-K9ZZ1'] } }), { timeZone: 'Asia/Kolkata', reload }).stop
		await interact()
		expect(reload).toHaveBeenCalledOnce()
		expect(w['ga-disable-G-ABC123XYZ']).toBe(true)
		expect(w['ga-disable-AW-1234567890']).toBe(true)
	})

	it('a choice taken back counts on a private address too, and a draft’s preview key is private', async () => {
		const reload = vi.fn()
		stop = startAdTags(enabledTags({ googleTagManager: GOOGLE }), { timeZone: 'Asia/Kolkata', reload }).stop
		await interact()
		history.replaceState(null, '', '/order-tracking?order=GC-1&key=abc')
		await choose({ ad_storage: 'denied', analytics_storage: 'denied' })
		expect(reload).toHaveBeenCalledOnce()
		stop()

		w.dataLayer = []
		delete w.gcGtag
		document.head.innerHTML = '<script></script>'
		history.replaceState(null, '', '/?preview=draft-key')
		localStorage.clear()
		stop = startAdTags(enabledTags({ googleTagManager: GOOGLE }), { timeZone: 'Asia/Kolkata' }).stop
		await interact()
		expect(google()).toEqual([])
	})

	it('a page change after loading is a page view for every pixel', async () => {
		const tags = startAdTags(
			{ meta: '1234567890', tiktok: 'C4ABCDEF12', pinterest: '2612345678901', snap: '6abc82ca-4a3a-4391-98ba-0317a8471234' },
			{ timeZone: 'Asia/Kolkata' }
		)
		stop = tags.stop
		tags.pageView()
		await interact()
		tags.pageView()
		expect(metaCalls().filter((a: unknown[]) => a[1] === 'PageView')).toHaveLength(2)
		expect(w.ttq.filter((a: unknown[]) => a[0] === 'page')).toHaveLength(2)
		expect(w.pintrk.queue.filter((a: unknown[]) => a[0] === 'page')).toHaveLength(2)
		expect(w.snaptr.queue.map((a: IArguments) => [...a]).filter((a: unknown[]) => a[1] === 'PAGE_VIEW')).toHaveLength(2)
	})
})
