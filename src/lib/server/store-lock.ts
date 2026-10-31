import { redirect, type RequestEvent } from '@sveltejs/kit'
import { services } from 'kitcommerce.config'
import { clientAddress } from '$lib/server/api-proxy'
import { chromePreview } from '$lib/composer/site-chrome'

export type LockReason = 'wrong' | 'throttled' | 'unavailable'

type StorePass = { token: string; expiresAt: Date }
type Unlock = { outcome: 'unlocked'; pass: StorePass } | { outcome: LockReason }

type LockHooks = {
	getStoreByIdOrDomain?: () => Promise<{ closed?: unknown } | null | undefined>
	unlockStore?: (password: string, options: { clientAddress?: string }) => Promise<{ outcome?: unknown; pass?: unknown } | null | undefined>
	checkStorePass?: (token: string) => Promise<unknown>
}
type PreviewHook = { getPageLayout?: (page: string, options: { preview: string }) => Promise<{ preview?: unknown } | null> }

// The __Host- prefix keeps a sibling store on the same base domain from planting a domain-wide cookie
// of this name, which browsers would send first and so lock the visitor out.
const passCookieName = (url: URL) => (url.protocol === 'https:' ? '__Host-store_pass' : 'store_pass')

const confirmedUntil = new Map<string, number>()
const CONFIRMED_FOR = 60_000
const MAX_CONFIRMED = 1000

export const lockPath = (pathname: string, reason?: LockReason) =>
	'/store-closed' + '/-'.repeat(Math.max(0, pathname.split('/').length - 2)) + (reason ? `?reason=${reason}` : '')

export const onSitePath = (url: URL) => '/' + url.pathname.replace(/^\/+/, '') + url.search

export function previewPage(url: URL): { page: string; key: string } | null {
	const chrome = chromePreview(url)
	if (chrome) return url.pathname === '/' ? { page: chrome.page, key: chrome.key } : null
	const key = url.searchParams.get('preview')
	if (!key) return null
	if (url.pathname === '/') return { page: 'home', key }
	if (url.pathname.startsWith('/products/')) return { page: 'product', key }
	if (url.pathname.startsWith('/collections/')) return { page: 'collection', key }
	return null
}

export async function guardClosedStore(event: RequestEvent, next: () => Response | Promise<Response>): Promise<Response> {
	if (event.isSubRequest || event.isDataRequest) return next()
	const stores = Reflect.get(services, 'storeService') as LockHooks | undefined
	if (typeof stores?.checkStorePass !== 'function') return next()
	const closed = await closedState(stores)
	if (!closed) return next()

	const token = event.cookies.get(passCookieName(event.url))
	const pass = token ? await passState(stores, passKey(event.url, token), token) : 'none'
	if (pass === 'valid') return privately(await next())

	const password = await typedPassword(event.request)
	if (password !== null) {
		if (crossSite(event) || !closed.password) return lockPage(event, { dropPass: pass === 'rejected' })
		const answer = await unlock(stores, password, clientAddress(event))
		if (answer.outcome === 'unlocked') {
			event.cookies.set(passCookieName(event.url), answer.pass.token, { ...passCookie(event.url), expires: answer.pass.expiresAt })
			confirm(passKey(event.url, answer.pass.token), answer.pass.expiresAt)
			redirect(303, onSitePath(event.url))
		}
		return lockPage(event, { reason: answer.outcome, dropPass: pass === 'rejected' })
	}

	if (await isPreview(event)) return next()
	return lockPage(event, { dropPass: pass === 'rejected' })
}

// Kit's own check is off (csrf.trustedOrigins). Hosts, not origins: behind a TLS proxy the storefront
// may see its own scheme as http.
function crossSite(event: RequestEvent): boolean {
	const origin = event.request.headers.get('origin')
	if (!origin) return false
	try {
		return new URL(origin).host !== event.url.host
	} catch {
		return true
	}
}

async function closedState(stores: LockHooks): Promise<{ password: boolean } | null> {
	try {
		const closed = (await stores.getStoreByIdOrDomain?.())?.closed
		return closed && typeof closed === 'object' ? { password: Reflect.get(closed, 'password') === true } : null
	} catch {
		return null
	}
}

async function typedPassword(request: Request): Promise<string | null> {
	const length = Number(request.headers.get('content-length') ?? Infinity)
	const form = request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')
	if (request.method !== 'POST' || !form || !(length <= 4096)) return null
	try {
		return new URLSearchParams(await request.clone().text()).get('password')
	} catch {
		return null
	}
}

const isPass = (value: unknown): value is StorePass => {
	const pass = value as Partial<StorePass> | null | undefined
	return typeof pass?.token === 'string' && pass.expiresAt instanceof Date && !Number.isNaN(pass.expiresAt.getTime())
}

async function unlock(stores: LockHooks, password: string, address: string | undefined): Promise<Unlock> {
	try {
		const answer = await stores.unlockStore?.(password, { clientAddress: address })
		if (answer?.outcome === 'unlocked' && isPass(answer.pass)) return { outcome: 'unlocked', pass: answer.pass }
		if (answer?.outcome === 'wrong' || answer?.outcome === 'throttled') return { outcome: answer.outcome }
	} catch {}
	// `open` too: the store took its password away moments ago, or the engine cannot read it, while
	// this page still asks for one.
	return { outcome: 'unavailable' }
}

const passKey = (url: URL, token: string) => `${url.host}\n${token}`

function confirm(key: string, expiresAt: Date) {
	confirmedUntil.delete(key)
	confirmedUntil.set(key, Math.min(Date.now() + CONFIRMED_FOR, expiresAt.getTime()))
	if (confirmedUntil.size > MAX_CONFIRMED) confirmedUntil.delete(confirmedUntil.keys().next().value!)
}

async function passState(stores: LockHooks, key: string, token: string): Promise<'valid' | 'rejected' | 'unknown'> {
	if ((confirmedUntil.get(key) ?? 0) > Date.now()) return 'valid'
	confirmedUntil.delete(key)
	try {
		const pass = await stores.checkStorePass?.(token)
		if (pass === null) return 'rejected'
		if (isPass(pass)) {
			confirm(key, pass.expiresAt)
			return 'valid'
		}
	} catch {}
	return 'unknown'
}

async function isPreview(event: RequestEvent): Promise<boolean> {
	const method = event.request.method
	const wanted = method === 'GET' || method === 'HEAD' ? previewPage(event.url) : null
	const layouts = Reflect.get(services, 'layoutService') as PreviewHook | undefined
	if (!wanted || typeof layouts?.getPageLayout !== 'function') return false
	try {
		return (await layouts.getPageLayout(wanted.page, { preview: wanted.key }))?.preview === true
	} catch {
		return false
	}
}

const passCookie = (url: URL) => ({ path: '/', httpOnly: true, sameSite: 'lax' as const, secure: url.protocol === 'https:' })

function privately(response: Response): Response {
	const headers = new Headers(response.headers)
	headers.set('cache-control', 'private, no-store')
	return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

async function lockPage(event: RequestEvent, { reason, dropPass = false }: { reason?: LockReason; dropPass?: boolean } = {}): Promise<Response> {
	const page = await event.fetch(lockPath(event.url.pathname, reason), {
		headers: { host: event.request.headers.get('host') ?? event.url.host }
	})
	const headers = new Headers({
		'content-type': page.headers.get('content-type') ?? 'text/html',
		'x-robots-tag': 'noindex',
		'cache-control': 'no-store'
	})
	// A Response built here skips Kit's cookie handling, so the deletion is written out by hand.
	if (dropPass) headers.append('set-cookie', event.cookies.serialize(passCookieName(event.url), '', { ...passCookie(event.url), maxAge: 0 }))
	return new Response(page.body, { status: 503, headers })
}
