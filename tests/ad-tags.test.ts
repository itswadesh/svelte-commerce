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

	beforeEach(() => {
		document.head.innerHTML = '<script></script>'
		localStorage.clear()
		history.replaceState(null, '', '/')
		for (const k of ['fbq', '_fbq', 'ttq', 'TiktokAnalyticsObject', 'pintrk', 'snaptr', 'clarity', 'hj', '_hjSettings']) delete w[k]
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
