// The store's ad and analytics tags (GoCommerce D160): the Meta pixel, Microsoft Clarity, Hotjar,
// and the TikTok, Pinterest and Snap pixels. Each is the store's own ID, which the connector hands
// over as store.plugins.<name> = { active, id }; ad-tags.svelte starts them.
//
// They hear the shopping events the storefront already sends GA4 — view_item, add_to_cart,
// begin_checkout, purchase — by listening on window.gtag, which app.html always defines. So an
// event fired anywhere, by this repo or by core, reaches every tag, and a new event site is one
// GA4 call rather than one per vendor.

import { onFirstInteraction } from '$lib/utils/on-first-interaction'

export type Vendor = 'meta' | 'clarity' | 'hotjar' | 'tiktok' | 'pinterest' | 'snap'
type ConsentKind = 'ad_storage' | 'analytics_storage'

// The ID goes into a script, so its shape is checked against the vendor's, never trusted.
const SOURCES: Record<Vendor, { plugin: string; id: RegExp; consent: ConsentKind }> = {
	meta: { plugin: 'facebookPixel', id: /^\d{5,20}$/, consent: 'ad_storage' },
	clarity: { plugin: 'microsoftClarity', id: /^[a-z0-9]{4,20}$/i, consent: 'analytics_storage' },
	hotjar: { plugin: 'hotjar', id: /^\d{1,12}$/, consent: 'analytics_storage' },
	tiktok: { plugin: 'tiktokPixel', id: /^[A-Z0-9]{8,32}$/i, consent: 'ad_storage' },
	pinterest: { plugin: 'pinterestTag', id: /^\d{5,20}$/, consent: 'ad_storage' },
	snap: { plugin: 'snapchatPixel', id: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, consent: 'ad_storage' }
}

export type TagIds = Partial<Record<Vendor, string>>

/** The tags this store switched on with a well-formed ID. Nothing else is ever loaded. */
export function enabledTags(plugins: Record<string, any> | null | undefined): TagIds {
	const out: TagIds = {}
	for (const [vendor, source] of Object.entries(SOURCES) as [Vendor, (typeof SOURCES)[Vendor]][]) {
		const p = plugins?.[source.plugin]
		const id = String(p?.id ?? '').trim()
		if (p?.active && source.id.test(id)) out[vendor] = id
	}
	return out
}

// The regions app.html's consent defaults treat as opt-in (EEA, UK, Switzerland), with the EU's
// zones outside Europe/ (Cyprus, Ceuta, the outermost regions). These tags do not read Google's
// consent mode, so the browser's time zone stands in for the visitor's country, and a zone that
// says nothing (empty, UTC, Etc/, as privacy browsers report) is treated as opt-in too.
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

/**
 * What each vendor is told for one GA4 event, by the names in its own docs. Only the product ids,
 * prices, units, value, currency and order number are passed on: core's GA4 payload also carries
 * hashed contact details, the user agent and IP addresses, and none of that is any vendor's here.
 */
export function vendorCalls(name: string, p: Ga4, tags: Vendor[]): Call[] {
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
	} catch {
		/* a vendor's script must never break the page */
	}
}

const SHOPPING = new Set(['view_item', 'add_to_cart', 'begin_checkout', 'purchase'])
const BUFFER = 20
// A query carrying an address or a credential: a verification link, an order's key. Every tag
// records the page's address, so none loads while the address bar holds one; the pages that read
// them take them out once read.
const PRIVATE_QUERY = /[?&](email|token|key)=/i
// The product page reports its view and so does core's product state, a moment apart.
const SAME_VIEW_MS = 10_000

const savedChoice = (choice?: Record<string, string>): string | null => {
	try {
		return choice ? JSON.stringify(choice) : localStorage.getItem('user_consent')
	} catch {
		return null /* storage blocked: no saved choice */
	}
}

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
	const loaded = new Set<Vendor>()
	let before: [string, Ga4][] | null = []
	let lastView = { id: '', at: 0 }
	let scanned = 0

	const hear = (name: string, params: Ga4) => {
		if (!SHOPPING.has(name)) return
		if (name === 'view_item') {
			const items = Array.isArray(params?.items) ? params.items : params?.items ? [params.items] : []
			const id = String(items[0]?.item_id ?? '')
			if (id === lastView.id && Date.now() - lastView.at < SAME_VIEW_MS) return
			lastView = { id, at: Date.now() }
		}
		if (before) {
			if (before.length < BUFFER) before.push([name, params])
			if (name === 'purchase') void load()
			return
		}
		vendorCalls(name, params, [...loaded]).forEach(send)
	}

	// Every gtag call lands in the dataLayer as gtag's arguments, whoever made it; they are read
	// from there in order, each once. The wrapper only says when to look.
	const scan = () => {
		const dl = w.dataLayer ?? []
		while (scanned < dl.length) {
			// Counted before it is heard: a purchase loads the tags, which scans again, and must not
			// hear the same purchase over and over.
			const command = dl[scanned++]
			if (command?.[0] === 'event') hear(String(command[1]), command[2] ?? {})
		}
	}
	let gtag = w.gtag
	const listening = function (this: unknown, ...args: unknown[]) {
		const out = gtag?.apply(this, args)
		scan()
		return out
	}
	// The GoogleAnalytics loader defines a gtag of its own when it starts, so the wrapper is put
	// back whenever it has been replaced.
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
		listen()
		if (PRIVATE_QUERY.test(location.search)) {
			waiting = true
			return
		}
		waiting = false
		const consent = savedChoice(choice)
		const allowed = enabled.filter((v) => consentAllows(SOURCES[v].consent, consent, timeZone))
		// A running tag cannot be unloaded, so a choice taken back starts the page again without it.
		if ([...loaded].some((v) => !allowed.includes(v))) return reload()
		const fresh = allowed.filter((v) => !loaded.has(v))
		if (fresh.length) {
			const { LOADERS } = await import('$lib/ad-tags-snippets.js')
			for (const vendor of fresh) {
				if (loaded.has(vendor)) continue
				try {
					LOADERS[vendor](ids[vendor])
					loaded.add(vendor)
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
			for (const [name, params] of queued) vendorCalls(name, params, fresh).forEach(send)
		}
	}

	const onChoice = (e: Event) => void load((e as CustomEvent).detail)
	const stopWaiting = onFirstInteraction(() => void load())
	window.addEventListener('consentchange', onChoice)

	return {
		stop() {
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
