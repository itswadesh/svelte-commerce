// A connector for a non-Litekart backend still inherits methods that reach for Litekart's REST API
// by path — `/api/orders`, `/api/reviews`, `/api/vendors`, dozens more. Those paths are relative, so
// in dev Vite proxies them to PUBLIC_LITEKART_API_URL || localhost:7000 and in production they hit
// the storefront's own origin. Either way there is no Litekart API behind a Medusa, Saleor or
// Vendure store — that package is not even installed — so the call can only fail, and it fails late
// and confusingly: a proxy ECONNREFUSED in the terminal, an empty page for the shopper.
//
// This blocks the whole class at the source. `BaseService.get/post/put/patch/delete` take the URL
// raw; the GraphQL path (`query()`) builds an absolute URL from the connector's own base URL and is
// untouched, as are absolute URLs anyone passes deliberately.
//
// It is a net, not a substitute for real work: the override module next to this file implements the
// services that matter natively. What lands here is the tail — features the backend genuinely has
// no equivalent for — and each one is reported once so it shows up while developing rather than
// silently returning nothing forever.

type RestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

/**
 * Answers a Litekart REST path from local data when we hold it. Registered by the override module,
 * which is the only place that can reach the storefront's own config. Return `undefined` to fall
 * through to the empty/throw behaviour below.
 */
export type LocalResolver = (url: string) => Promise<unknown> | unknown | undefined

let localResolver: LocalResolver | undefined

export const serveLitekartRestLocally = (resolver: LocalResolver) => {
	localResolver = resolver
}

const READ_METHODS: RestMethod[] = ['get']
const WRITE_METHODS: RestMethod[] = ['post', 'put', 'patch', 'delete']

const LITEKART_REST = /^\/api\//

// The shape most list call sites destructure.
const emptyResult = () => ({ data: [], count: 0, pageSize: 0, noOfPage: 0, page: 1 })

// `/api/vendors` and `/api/orders?page=1` address a collection; `/api/vendors/42` addresses one
// record. The distinction decides what an unimplemented read does: an absent collection is a
// legitimate empty state — this store has no vendors — while an absent record is a dead link, and
// answering it with an empty object renders a blank detail page that merely looks broken. So
// collections resolve empty and records throw, like writes do.
//
// The trailing segment is what separates them, except where a connector spells a list endpoint as
// a sub-path (`/api/orders/list-by-parent`) or a singleton as a word (`/api/users/me`). Those are
// listed here; anything unrecognised is treated as a record id.
const COLLECTION_SEGMENTS = new Set([
	'all',
	'list',
	'list-by-parent',
	'list-public',
	'latest',
	'search',
	'public',
	'public-details',
	'me',
	'multiple'
])

const addressesOneRecord = (url: string) => {
	const segments = url.split('?')[0].split('/').filter(Boolean)
	if (segments.length < 3) return false
	return !COLLECTION_SEGMENTS.has(segments[segments.length - 1].toLowerCase())
}

const reported = new Set<string>()

const report = (connector: string, method: RestMethod, url: string) => {
	const key = `${method} ${url.split('?')[0]}`
	if (reported.has(key)) return
	reported.add(key)
	console.warn(
		`[${connector}] no native implementation for \`${key}\` — this is a Litekart REST path and was not called. ` +
			`Add an override in src/lib/core/connectors/${connector}.ts if ${connector} can serve it.`
	)
}

// Whatever the connector calls its BaseService. Only the prototype is touched, and each connector
// declares its own class, so this stays structural rather than naming one package's type.
type Patchable = { prototype: object }

/**
 * Stops every Litekart REST path in a connector from being requested.
 *
 * Collection reads resolve to an empty result so the page renders its empty state; single-record
 * reads and every write throw, because a blank detail page reads as broken and a silent success
 * would tell the shopper their review, enquiry or upload was saved when nothing left the browser.
 * Call once per override module, passing the connector's own BaseService.
 */
export const blockLitekartRest = (BaseService: Patchable, connectorName: string) => {
	const proto = BaseService.prototype as Record<string, any>
	if (proto.__litekartRestBlocked) return
	proto.__litekartRestBlocked = true

	for (const method of READ_METHODS) {
		const original = proto[method] as (this: unknown, url: string, ...rest: unknown[]) => Promise<unknown>
		if (typeof original !== 'function') continue
		proto[method] = async function (this: unknown, url: string, ...rest: unknown[]) {
			if (typeof url === 'string' && LITEKART_REST.test(url)) {
				// Local first: the storefront ships static data for several of these (menus, countries,
				// currencies, plugin toggles…), and serving it beats answering empty just because the
				// backend has no endpoint of its own.
				const local = await localResolver?.(url)
				if (local !== undefined) return local

				report(connectorName, method, url)
				if (addressesOneRecord(url)) {
					throw new Error(`This item is not available on this store (${connectorName}).`)
				}
				return emptyResult()
			}
			return original.call(this, url, ...rest)
		}
	}

	for (const method of WRITE_METHODS) {
		const original = proto[method] as (this: unknown, url: string, ...rest: unknown[]) => Promise<unknown>
		if (typeof original !== 'function') continue
		proto[method] = function (this: unknown, url: string, ...rest: unknown[]) {
			if (typeof url === 'string' && LITEKART_REST.test(url)) {
				report(connectorName, method, url)
				return Promise.reject(new Error(`This feature is not available on this store (${connectorName}).`))
			}
			return original.call(this, url, ...rest)
		}
	}
}
