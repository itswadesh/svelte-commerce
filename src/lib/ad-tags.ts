// The store's ad and analytics tags (GoCommerce D160): the Meta pixel, Microsoft Clarity, Hotjar,
// the TikTok, Pinterest and Snap pixels, and Google Analytics, Ads and Tag Manager. Each is the
// store's own ID, which the connector hands over as store.plugins.<name> = { active, id }, and the
// Google ones as googleTagManager = { active, tags, conversions }, the shape Litekart used;
// ad-tags.svelte starts them.
//
// They hear the events the storefront already sends GA4 — view_item, add_to_cart, begin_checkout,
// purchase and the rest — by listening on window.gtag, which app.html always defines. So an event
// fired anywhere, by this repo or by core, reaches every tag, and a new event site is one GA4 call
// rather than one per vendor.

import { onFirstInteraction } from '$lib/utils/on-first-interaction'

export type Vendor = 'meta' | 'clarity' | 'hotjar' | 'tiktok' | 'pinterest' | 'snap' | 'ga4' | 'gads' | 'gtm'
type ConsentKind = 'ad_storage' | 'analytics_storage'

// The ID goes into a script, so its shape is checked against the vendor's, never trusted.
const SOURCES: Record<Vendor, { plugin: string; id: RegExp; consent: ConsentKind }> = {
	meta: { plugin: 'facebookPixel', id: /^\d{5,20}$/, consent: 'ad_storage' },
	clarity: { plugin: 'microsoftClarity', id: /^[a-z0-9]{4,20}$/i, consent: 'analytics_storage' },
	hotjar: { plugin: 'hotjar', id: /^\d{1,12}$/, consent: 'analytics_storage' },
	tiktok: { plugin: 'tiktokPixel', id: /^[A-Z0-9]{8,32}$/i, consent: 'ad_storage' },
	pinterest: { plugin: 'pinterestTag', id: /^\d{5,20}$/, consent: 'ad_storage' },
	snap: { plugin: 'snapchatPixel', id: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, consent: 'ad_storage' },
	ga4: { plugin: 'googleTagManager', id: /^G-[A-Z0-9]{4,16}$/i, consent: 'analytics_storage' },
	gads: { plugin: 'googleTagManager', id: /^AW-\d{5,16}$/, consent: 'ad_storage' },
	gtm: { plugin: 'googleTagManager', id: /^GTM-[A-Z0-9]{4,12}$/i, consent: 'analytics_storage' }
}

export type TagIds = Partial<Record<Vendor, string>>

/** Every ID a plugin carries: its `id`, and for Google its `tags`, a list or one string. */
const idsOf = (p: Record<string, any> | undefined): string[] =>
	[p?.id, ...(Array.isArray(p?.tags) ? p.tags : [p?.tags])].map((t) => String((t && typeof t === 'object' ? t.id : t) ?? '').trim())

/**
 * The tags this store switched on with a well-formed ID. Nothing else is ever loaded. Google Ads is
 * `AW-…/label` when the store gave the purchase's conversion label: the account and the conversion,
 * as Google's `send_to` writes them.
 *
 * A Tag Manager container takes over Analytics and Ads. Google's advice is to deploy each with one
 * or the other, never both, and a container can hold either, so loading the IDs here as well could
 * count every page view and sale twice. A store with a container sets Analytics and Ads up in it.
 */
export function enabledTags(plugins: Record<string, any> | null | undefined): TagIds {
	const out: TagIds = {}
	for (const [vendor, source] of Object.entries(SOURCES) as [Vendor, (typeof SOURCES)[Vendor]][]) {
		const p = plugins?.[source.plugin]
		const id = idsOf(p).find((id) => source.id.test(id))
		if (p?.active && id) out[vendor] = id
	}
	const label = String(plugins?.googleTagManager?.conversions?.find((c: any) => c?.event === 'purchase')?.label ?? '').trim()
	if (out.gads && /^[\w-]{4,64}$/.test(label)) out.gads += '/' + label
	if (out.gtm) {
		delete out.ga4
		delete out.gads
	}
	return out
}

// The regions app.html's consent defaults treat as opt-in (EEA, UK, Switzerland), with the EU's
// zones outside Europe/ (Cyprus, Ceuta, the outermost regions). Only Google's tags read Google's
// consent mode, and every tag waits the same way, so the browser's time zone stands in for the
// visitor's country, and a zone that says nothing (empty, UTC, Etc/, as privacy browsers report) is
// treated as opt-in too.
// ponytail: a time zone is a proxy for a country; use the host's country header if one reaches the page.
const OPT_IN_ZONE =
	/^(|UTC|Etc\/.*|Europe\/.*|Arctic\/Longyearbyen|Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe)|Asia\/(Nicosia|Famagusta)|Africa\/Ceuta|Indian\/(Reunion|Mayotte)|America\/(Guadeloupe|Martinique|Cayenne|Marigot|St_Barthelemy))$/

/** A saved cookie choice decides; without one, opt-in regions wait for the banner and elsewhere may load. */
export function consentAllows(kind: ConsentKind, savedConsent: string | null, timeZone: string): boolean {
	try {
		const saved = JSON.parse(savedConsent || 'null')
		if (saved) return saved[kind] === 'granted'
	} catch {
		/* an unreadable choice is no choice */
	}
	return !OPT_IN_ZONE.test(timeZone)
}

type Item = { item_id?: unknown; price?: unknown; quantity?: unknown }
type Ga4 = { currency?: string; value?: unknown; transaction_id?: unknown; items?: Item | Item[] }
export type Call = [Vendor, ...unknown[]]

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0)

// The GA4 event parameters Google is told. Core's payload also carries the shopper's hashed
// contact details, address, IP addresses and user agent, and some of its events pass a whole record
// through (sign-out sends the user's), so only these are kept: Google's terms forbid personal data
// in event parameters. `send_to` and `groups` are left out too, so no event picks its own tag.
const GA4_PARAMS = new Set([
	'currency',
	'value',
	'transaction_id',
	'tax',
	'shipping',
	'coupon',
	'affiliation',
	'items',
	'item_list_id',
	'item_list_name',
	'item_id',
	'item_name',
	'search_term',
	'payment_type',
	'shipping_tier',
	'method',
	'form_type',
	'contact_method',
	'checkout_step',
	'order_id'
])
const pick = (p: object) => Object.fromEntries(Object.entries(p ?? {}).filter(([k]) => GA4_PARAMS.has(k)))

/**
 * What each vendor is told for one GA4 event, by the names in its own docs. The pixels get only the
 * product ids, prices, units, value, currency and order number, and only for the four shopping
 * events; Google gets every event, with its e-commerce parameters only. GA4's events are sent to GA4
 * alone, and a purchase is Google Ads' conversion when the store gave its label (`AW-…/label`), so
 * an Ads account never counts a sale twice.
 */
export function vendorCalls(name: string, p: Ga4, tags: Vendor[], google: TagIds = {}): Call[] {
	const list = (Array.isArray(p?.items) ? p.items : p?.items ? [p.items] : []).filter((i) => i?.item_id != null && i.item_id !== '')
	const items = list.map((i) => ({ id: String(i.item_id), price: num(i.price), quantity: num(i.quantity) || 1 }))
	const ids = items.map((i) => i.id)
	const units = items.reduce((n, i) => n + i.quantity, 0)
	const value = num(p?.value)
	const currency = p?.currency
	const order = p?.transaction_id != null ? String(p.transaction_id) : ''
	const calls: Call[] = []

	const meta = { content_ids: ids, content_type: 'product', contents: items.map((i) => ({ id: i.id, quantity: i.quantity })), currency, value }
	const tiktok = {
		contents: items.map((i) => ({ content_id: i.id, content_type: 'product', quantity: i.quantity, price: i.price })),
		currency,
		value
	}
	const lineItems = items.map((i) => ({ product_id: i.id, product_price: i.price, product_quantity: i.quantity }))
	const snap = { item_ids: ids, price: value, currency }

	switch (name) {
		case 'view_item':
			calls.push(['meta', 'track', 'ViewContent', meta])
			calls.push(['tiktok', 'track', 'ViewContent', tiktok])
			calls.push(['pinterest', 'track', 'pagevisit', { line_items: lineItems, currency, value }])
			calls.push(['snap', 'track', 'VIEW_CONTENT', snap])
			break
		case 'add_to_cart':
			calls.push(['meta', 'track', 'AddToCart', meta])
			calls.push(['tiktok', 'track', 'AddToCart', tiktok])
			calls.push(['pinterest', 'track', 'addtocart', { line_items: lineItems, currency, value, order_quantity: units }])
			calls.push(['snap', 'track', 'ADD_CART', { ...snap, number_items: units }])
			break
		case 'begin_checkout':
			calls.push(['meta', 'track', 'InitiateCheckout', { content_ids: ids, contents: meta.contents, currency, value, num_items: units }])
			calls.push(['tiktok', 'track', 'InitiateCheckout', tiktok])
			calls.push(['snap', 'track', 'START_CHECKOUT', { ...snap, number_items: units }])
			break
		case 'purchase':
			// The order number is Meta's eventID because the engine's Conversions API sends the same
			// purchase with it as event_id, and Meta keeps one of the two.
			if (!order) break
			calls.push(['meta', 'track', 'Purchase', { ...meta, num_items: units }, { eventID: order }])
			calls.push(['tiktok', 'track', 'Purchase', tiktok])
			calls.push(['pinterest', 'track', 'checkout', { line_items: lineItems, currency, value, order_quantity: units, order_id: order }])
			calls.push(['snap', 'track', 'PURCHASE', { ...snap, number_items: units, transaction_id: order }])
			break
	}
	calls.push(['ga4', 'event', name, google.ga4 ? { ...pick(p), send_to: google.ga4 } : pick(p)])
	if (name === 'purchase' && order && google.gads?.includes('/')) {
		calls.push(['gads', 'event', 'conversion', { send_to: google.gads, value, currency, transaction_id: order }])
	}
	// Google's e-commerce guide for Tag Manager: the event under `event`, its details under `ecommerce`.
	calls.push(['gtm', { event: name, ecommerce: pick(p) }])
	return calls.filter(([vendor]) => tags.includes(vendor))
}

/** Sends one call to a loaded vendor's own function. TikTok's is an object of methods. */
function send([vendor, ...args]: Call): void {
	const w = window as any
	try {
		if (vendor === 'meta') w.fbq?.(...args)
		else if (vendor === 'tiktok') w.ttq?.[args[0] as string]?.(...args.slice(1))
		else if (vendor === 'pinterest') w.pintrk?.(...args)
		else if (vendor === 'snap') w.snaptr?.(...args)
		else if (vendor === 'ga4' || vendor === 'gads') w.gcGtag?.(...args)
		else if (vendor === 'gtm') {
			// Cleared first, as Google's guide does, so one event's items never carry into the next.
			w.gtmLayer?.push({ ecommerce: null })
			w.gtmLayer?.push(args[0])
		}
	} catch {
		/* a vendor's script must never break the page */
	}
}

const SHOPPING = new Set(['view_item', 'add_to_cart', 'begin_checkout', 'purchase'])
const BUFFER = 20
// A query carrying an address or a credential: a verification link, an order's key. Every tag
// records the page's address, so none loads while the address bar holds one; the pages that read
// them take them out once read.
// A draft's preview key is one too.
const PRIVATE_QUERY = /[?&](email|token|key|preview)=/i
// The product page reports its view and so does core's product state, a moment apart.
const SAME_VIEW_MS = 10_000

const savedChoice = (choice?: Record<string, string>): string | null => {
	try {
		return choice ? JSON.stringify(choice) : localStorage.getItem('user_consent')
	} catch {
		return null /* storage blocked: no saved choice */
	}
}

// What a page has read from its dataLayer and the tags it loaded, each with the ID it loaded with,
// kept with that dataLayer: a bridge started again (the store's tags changed) neither hears an old
// purchase again nor loads a tag twice, and can still turn off a tag it no longer has an ID for.
const pages = new WeakMap<object, { read: number; loaded: Map<Vendor, string>; consent: unknown[][] }>()

/**
 * Starts the store's tags. Each loads on the shopper's first interaction — out of the first paint,
 * like Klaviyo and the chat widgets — and only where consent allows it; a choice made later in the
 * cookie banner (consentchange) loads what it allows from then on, and one taken back reloads the
 * page without it. Shopping events seen before the first load are kept and handed to the tags that
 * load then; a purchase loads them at once, since the page a payment gateway returns to may never
 * be touched.
 */
export function startAdTags(
	ids: TagIds,
	{ timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '', reload = () => location.reload() } = {}
) {
	const enabled = Object.keys(ids) as Vendor[]
	if (!enabled.length) return { stop() {}, pageView() {} }

	const w = window as any
	const dataLayer = (w.dataLayer ??= [])
	const memory = pages.get(dataLayer) ?? { read: 0, loaded: new Map<Vendor, string>(), consent: [] }
	pages.set(dataLayer, memory)
	const { loaded, consent: consentCommands } = memory
	// Kept until the first load; tags already running hear each event as it comes.
	let before: [string, Ga4][] | null = loaded.size ? null : []
	let lastView = { id: '', at: 0 }
	// Each load() takes a number; one overtaken by a newer choice, or by stop(), loads nothing.
	let runs = 0

	const hear = (name: string, params: Ga4) => {
		if (name === 'view_item') {
			const items = Array.isArray(params?.items) ? params.items : params?.items ? [params.items] : []
			const id = String(items[0]?.item_id ?? '')
			if (id === lastView.id && Date.now() - lastView.at < SAME_VIEW_MS) return
			lastView = { id, at: Date.now() }
		}
		if (before) {
			if (SHOPPING.has(name) && before.length < BUFFER) before.push([name, params])
			if (name === 'purchase') void load()
			return
		}
		// Every tag records the page's address with what it is told.
		if (PRIVATE_QUERY.test(location.search)) return
		vendorCalls(name, params, [...loaded.keys()], ids).forEach(send)
	}

	// Every gtag call lands in the dataLayer as gtag's arguments, whoever made it; they are read
	// from there in order, each once. The wrapper only says when to look. Google's consent commands,
	// from app.html and the banner, are kept for Google's tags, which read them on layers of their own.
	const scan = () => {
		while (memory.read < dataLayer.length) {
			// Counted before it is heard: a purchase loads the tags, which scans again, and must not
			// hear the same purchase over and over.
			const command = dataLayer[memory.read++]
			if (command?.[0] === 'event') hear(String(command[1]), command[2] ?? {})
			else if (command?.[0] === 'consent') {
				const copy = Array.from(command)
				consentCommands.push(copy)
				if (loaded.has('ga4') || loaded.has('gads')) w.gcGtag(...copy)
				if (loaded.has('gtm')) w.gtmGtag(...copy)
			}
		}
	}
	let gtag = w.gtag
	const listening = function (this: unknown, ...args: unknown[]) {
		const out = gtag?.apply(this, args)
		scan()
		return out
	}
	// A Google snippet in the store's header scripts defines a gtag of its own when it runs, so the
	// wrapper is put back whenever it has been replaced.
	const listen = () => {
		if (w.gtag !== listening) {
			gtag = w.gtag
			w.gtag = listening
		}
		scan()
	}
	// Before the first scan, which can hear a purchase and so load.
	let waiting = false
	listen()

	async function load(choice?: Record<string, string>) {
		const run = ++runs
		listen()
		const consent = savedChoice(choice)
		const allowed = enabled.filter((v) => consentAllows(SOURCES[v].consent, consent, timeZone))
		// A running tag cannot be unloaded, so a choice taken back starts the page again without it.
		// Google's own opt-out flag stops its tag at once, so it sends nothing more as the page goes.
		const withdrawn = [...loaded.keys()].filter((v) => !allowed.includes(v))
		if (withdrawn.length) {
			for (const v of withdrawn) if (v === 'ga4' || v === 'gads') w['ga-disable-' + loaded.get(v)!.split('/')[0]] = true
			return reload()
		}
		if (PRIVATE_QUERY.test(location.search)) {
			waiting = true
			return
		}
		waiting = false
		const fresh = allowed.filter((v) => !loaded.has(v))
		const { LOADERS } = fresh.length ? await import('$lib/ad-tags-snippets.js') : { LOADERS: null }
		// A choice made while the snippets were on their way (the banner's "Required only" on a slow
		// phone) is the one that stands.
		if (run !== runs) return
		if (LOADERS) {
			for (const vendor of fresh) {
				if (loaded.has(vendor)) continue
				try {
					LOADERS[vendor](ids[vendor], consentCommands)
					loaded.set(vendor, ids[vendor]!)
				} catch {
					/* a vendor's snippet must never break the page */
				}
			}
		}
		// Only the first load hears what happened before it; a tag allowed later starts from then,
		// so nothing from before a shopper's consent reaches a vendor.
		if (before) {
			const queued = before
			before = null
			for (const [name, params] of queued) vendorCalls(name, params, fresh, ids).forEach(send)
		}
	}

	const onChoice = (e: Event) => void load((e as CustomEvent).detail)
	const stopWaiting = onFirstInteraction(() => void load())
	window.addEventListener('consentchange', onChoice)

	return {
		stop() {
			runs++
			stopWaiting()
			window.removeEventListener('consentchange', onChoice)
			if (w.gtag === listening) w.gtag = gtag
		},
		/**
		 * A client-side page change, once the new page is in place and has taken anything private
		 * out of its address. Every pixel's page view is sent from here; Meta's own history
		 * tracking is off (ad-tags-snippets.js) because it fires before the page has done that.
		 */
		pageView() {
			listen()
			if (waiting) return void load()
			if (PRIVATE_QUERY.test(location.search)) return
			if (loaded.has('meta')) send(['meta', 'track', 'PageView'])
			if (loaded.has('tiktok')) send(['tiktok', 'page'])
			if (loaded.has('pinterest')) send(['pinterest', 'page'])
			if (loaded.has('snap')) send(['snap', 'track', 'PAGE_VIEW'])
		}
	}
}
