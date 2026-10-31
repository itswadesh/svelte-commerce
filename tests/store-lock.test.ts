import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import type { RequestEvent } from '@sveltejs/kit'
import { services } from 'kitcommerce.config'
import { guardClosedStore, lockPath, onSitePath, previewPage } from '$lib/server/store-lock'
import { load } from '../src/routes/store-closed/[...rest]/+page.server'
import LockPage from '../src/routes/store-closed/[...rest]/+page.svelte'

vi.mock('$lib/core/utils', () => ({ cn: (...c: unknown[]) => c.filter(Boolean).join(' ') }))

const svc = services as Record<string, unknown>

afterEach(() => {
	delete svc.storeService
	delete svc.layoutService
})

const LOCKED = '<main>Launching soon</main>'

type Visit = {
	method?: string
	body?: string
	type?: string
	origin?: string
	cookies?: Record<string, string>
	extra?: Record<string, string>
	isDataRequest?: boolean
	isSubRequest?: boolean
}

function visit(
	href: string,
	{
		method = 'GET',
		body,
		type = 'application/x-www-form-urlencoded',
		origin,
		cookies = {},
		extra = {},
		isDataRequest = false,
		isSubRequest = false
	}: Visit = {}
) {
	const url = new URL(href)
	const headers: Record<string, string> = { host: url.host }
	if (body) {
		headers['content-type'] = type
		headers['content-length'] = String(new TextEncoder().encode(body).length)
	}
	if (origin) headers.origin = origin
	Object.assign(headers, extra)
	const fetch = vi.fn(async (_path: string, _init?: RequestInit) => new Response(LOCKED, { headers: { 'content-type': 'text/html' } }))
	const set = vi.fn()
	const event = {
		url,
		request: new Request(url, { method, headers, body }),
		isDataRequest,
		isSubRequest,
		fetch,
		getClientAddress: () => '203.0.113.9',
		cookies: {
			get: (name: string) => cookies[name],
			set,
			serialize: (name: string, value: string, o: { path: string; maxAge: number; httpOnly: boolean; secure: boolean; sameSite: string }) =>
				`${name}=${value}; Max-Age=${o.maxAge}; Path=${o.path}${o.httpOnly ? '; HttpOnly' : ''}${o.secure ? '; Secure' : ''}; SameSite=${o.sameSite}`
		}
	}
	const page = new Response('the page', { headers: { 'cache-control': 'public, max-age=60' } })
	const next = vi.fn(async () => page)
	return { event: event as unknown as RequestEvent, fetch, set, next, page }
}

function closedStore(closed: { message: string; password: boolean } | null = { message: 'Launching soon', password: true }) {
	const store = {
		getStoreByIdOrDomain: vi.fn(async () => ({ name: 'Acme', closed: closed ?? undefined })),
		checkStorePass: vi.fn(async (_token: string): Promise<{ token: string; expiresAt: Date } | null> => null),
		unlockStore: vi.fn(async (_password: string, _options: { clientAddress?: string }): Promise<unknown> => ({ outcome: 'wrong' }))
	}
	svc.storeService = store
	return store
}

async function thrown(promise: Promise<unknown>) {
	try {
		await promise
	} catch (e) {
		return e
	}
	throw new Error('nothing was thrown')
}

describe('the closed-store gate', () => {
	it('never locks on a backend without store passes, and never reads the store there', async () => {
		const getStoreByIdOrDomain = vi.fn(async () => ({ closed: { message: 'Launching soon', password: true } }))
		svc.storeService = { getStoreByIdOrDomain }
		const { event, next, page } = visit('https://acme.test/products/tee')
		expect(await guardClosedStore(event, next)).toBe(page)
		expect(next).toHaveBeenCalledTimes(1)
		expect(getStoreByIdOrDomain).toHaveBeenCalledTimes(0)
	})

	it('lets everyone in while the store is open', async () => {
		closedStore(null)
		const { event, next, page } = visit('https://acme.test/products/tee')
		expect(await guardClosedStore(event, next)).toBe(page)
	})

	it('draws the lock page in place, at the depth of the address asked for, with a 503', async () => {
		closedStore()
		const { event, next, fetch } = visit('https://acme.test/products/tee')
		const response = await guardClosedStore(event, next)
		expect(fetch).toHaveBeenCalledTimes(1)
		expect(fetch.mock.calls[0][0]).toBe('/store-closed/-')
		expect(fetch.mock.calls[0][1]).toEqual({ headers: { host: 'acme.test' } })
		expect(response.status).toBe(503)
		expect(response.headers.get('x-robots-tag')).toBe('noindex')
		expect(response.headers.get('cache-control')).toBe('no-store')
		expect(response.headers.get('content-type')).toBe('text/html')
		expect(response.headers.get('set-cookie')).toBeNull()
		expect(await response.text()).toBe(LOCKED)
		expect(next).toHaveBeenCalledTimes(0)
	})

	it('passes data requests and its own sub-requests', async () => {
		closedStore()
		for (const flags of [{ isDataRequest: true }, { isSubRequest: true }]) {
			const { event, next, page, fetch } = visit('https://acme.test/products/tee', flags)
			expect(await guardClosedStore(event, next)).toBe(page)
			expect(fetch).toHaveBeenCalledTimes(0)
		}
	})

	it('lets a valid pass in, privately, and asks the engine once a minute per store', async () => {
		const store = closedStore()
		store.checkStorePass.mockImplementation(async (token) => ({ token, expiresAt: new Date('2099-01-01T00:00:00Z') }))
		for (let i = 0; i < 2; i++) {
			const { event, next } = visit('https://acme.test/products/tee', { cookies: { '__Host-store_pass': 'pass-for-acme' } })
			const response = await guardClosedStore(event, next)
			expect(response.headers.get('cache-control')).toBe('private')
			expect(await response.text()).toBe('the page')
		}
		expect(store.checkStorePass.mock.calls).toEqual([['pass-for-acme']])

		const { event, next } = visit('https://other.test/products/tee', { cookies: { '__Host-store_pass': 'pass-for-acme' } })
		await guardClosedStore(event, next)
		expect(store.checkStorePass.mock.calls).toEqual([['pass-for-acme'], ['pass-for-acme']])
	})

	it('reads only the __Host- pass on https, so a sibling store cannot plant one', async () => {
		const store = closedStore()
		store.checkStorePass.mockImplementation(async (token) => (token === 'real' ? { token, expiresAt: new Date('2099-01-01T00:00:00Z') } : null))
		const { event, next } = visit('https://acme.test/', { cookies: { store_pass: 'planted', '__Host-store_pass': 'real' } })
		const response = await guardClosedStore(event, next)
		expect([response.status, await response.text()]).toEqual([200, 'the page'])
		expect(store.checkStorePass.mock.calls).toEqual([['real']])
	})

	it('locks out a pass the engine rejects, and drops its cookie', async () => {
		closedStore()
		const { event, next } = visit('http://acme.test/', { cookies: { store_pass: 'a-revoked-pass' } })
		const response = await guardClosedStore(event, next)
		expect(response.status).toBe(503)
		expect(response.headers.get('set-cookie')).toBe('store_pass=; Max-Age=0; Path=/; HttpOnly; SameSite=lax')
	})

	it('keeps a pass the engine could not check, without letting it in', async () => {
		const store = closedStore()
		store.checkStorePass.mockRejectedValue(new Error('engine down'))
		const { event, next } = visit('https://acme.test/', { cookies: { '__Host-store_pass': 'a-pass-while-down' } })
		const response = await guardClosedStore(event, next)
		expect(response.status).toBe(503)
		expect(response.headers.get('set-cookie')).toBeNull()
	})

	it('trades the right password for a pass and returns to the page asked for', async () => {
		const store = closedStore()
		const expiresAt = new Date('2099-11-30T00:00:00Z')
		store.unlockStore.mockResolvedValue({ outcome: 'unlocked', pass: { token: '1793000000.c2ln', expiresAt } })
		const { event, next, set } = visit('https://acme.test/products/tee?variant_id=3', {
			method: 'POST',
			body: 'store_password=launch-day',
			origin: 'https://acme.test'
		})
		const redirect = await thrown(guardClosedStore(event, next))
		expect(redirect).toMatchObject({ status: 303, location: '/products/tee?variant_id=3' })
		expect(store.unlockStore.mock.calls).toEqual([['launch-day', { clientAddress: '203.0.113.9' }]])
		expect(set.mock.calls).toEqual([
			['__Host-store_pass', '1793000000.c2ln', { path: '/', httpOnly: true, sameSite: 'lax', secure: true, expires: expiresAt }]
		])

		const after = visit('https://acme.test/products/tee?variant_id=3', { cookies: { '__Host-store_pass': '1793000000.c2ln' } })
		expect((await guardClosedStore(after.event, after.next)).headers.get('cache-control')).toBe('private')
		expect(store.checkStorePass).toHaveBeenCalledTimes(0)
	})

	it('names the pass store_pass over plain http, where a __Host- cookie cannot be set', async () => {
		const store = closedStore()
		const expiresAt = new Date('2099-11-30T00:00:00Z')
		store.unlockStore.mockResolvedValue({ outcome: 'unlocked', pass: { token: '1793000000.c2ln', expiresAt } })
		const { event, next, set } = visit('http://acme.test/', { method: 'POST', body: 'store_password=launch-day' })
		expect(await thrown(guardClosedStore(event, next))).toMatchObject({ status: 303, location: '/' })
		expect(set.mock.calls).toEqual([
			['store_pass', '1793000000.c2ln', { path: '/', httpOnly: true, sameSite: 'lax', secure: false, expires: expiresAt }]
		])
	})

	it('answers a refused password on the lock page with its reason', async () => {
		const store = closedStore()
		const shown = []
		for (const outcome of ['wrong', 'throttled', 'unavailable', 'open', 'something new']) {
			store.unlockStore.mockResolvedValue({ outcome })
			const { event, next, fetch, set } = visit('https://acme.test/products/tee', { method: 'POST', body: 'store_password=nope' })
			const response = await guardClosedStore(event, next)
			shown.push([response.status, fetch.mock.calls[0][0], set.mock.calls.length])
		}
		expect(shown).toEqual([
			[503, '/store-closed/-?reason=wrong', 0],
			[503, '/store-closed/-?reason=throttled', 0],
			[503, '/store-closed/-?reason=unavailable', 0],
			[503, '/store-closed/-?reason=stopped', 0],
			[503, '/store-closed/-?reason=unavailable', 0]
		])
	})

	it('spends no try on a post from another site, or on a store with no password', async () => {
		const store = closedStore()
		const crossSite = visit('https://acme.test/', { method: 'POST', body: 'store_password=launch-day', origin: 'https://evil.example' })
		expect((await guardClosedStore(crossSite.event, crossSite.next)).status).toBe(503)
		expect(crossSite.fetch.mock.calls[0][0]).toBe('/store-closed?reason=unavailable')

		const passwordless = closedStore({ message: 'Back in May', password: false })
		const noPassword = visit('https://acme.test/', { method: 'POST', body: 'store_password=launch-day' })
		expect((await guardClosedStore(noPassword.event, noPassword.next)).status).toBe(503)
		expect([store.unlockStore.mock.calls.length, passwordless.unlockStore.mock.calls.length]).toEqual([0, 0])
	})

	it('takes a post from its own host whatever scheme the server believes it has', async () => {
		const store = closedStore()
		const behindProxy = visit('https://acme.test/', { method: 'POST', body: 'store_password=nope', origin: 'http://acme.test' })
		await guardClosedStore(behindProxy.event, behindProxy.next)
		expect(store.unlockStore.mock.calls).toEqual([['nope', { clientAddress: '203.0.113.9' }]])
	})

	it('trusts Sec-Fetch-Site over the Origin host, and says why it refused', async () => {
		const store = closedStore()
		const sibling = visit('https://acme.test/', {
			method: 'POST',
			body: 'store_password=nope',
			origin: 'https://acme.test',
			extra: { 'sec-fetch-site': 'same-site' }
		})
		await guardClosedStore(sibling.event, sibling.next)
		expect(sibling.fetch.mock.calls[0][0]).toBe('/store-closed?reason=unavailable')

		const rewritten = visit('https://internal.acme/', {
			method: 'POST',
			body: 'store_password=nope',
			origin: 'https://acme.test',
			extra: { 'sec-fetch-site': 'same-origin' }
		})
		await guardClosedStore(rewritten.event, rewritten.next)
		expect(store.unlockStore.mock.calls).toEqual([['nope', { clientAddress: '203.0.113.9' }]])
	})

	it('sends a lock form back to its page once the store is open, or the visitor already in', async () => {
		closedStore(null)
		const opened = visit('https://acme.test/products/tee', { method: 'POST', body: 'store_password=launch-day' })
		expect(await thrown(guardClosedStore(opened.event, opened.next))).toMatchObject({ status: 303, location: '/products/tee' })

		const store = closedStore()
		store.checkStorePass.mockImplementation(async (token) => ({ token, expiresAt: new Date('2099-01-01T00:00:00Z') }))
		const secondTab = visit('https://acme.test/products/tee', {
			method: 'POST',
			body: 'store_password=launch-day',
			cookies: { '__Host-store_pass': 'second-tab' }
		})
		expect(await thrown(guardClosedStore(secondTab.event, secondTab.next))).toMatchObject({ status: 303, location: '/products/tee' })
		expect(store.unlockStore.mock.calls).toEqual([])
	})

	it('locks a store closed without a password to every pass, without asking the engine', async () => {
		const store = closedStore({ message: 'Back in May', password: false })
		const { event, next } = visit('https://acme.test/', { cookies: { '__Host-store_pass': 'from-before' } })
		const response = await guardClosedStore(event, next)
		expect([response.status, response.headers.get('set-cookie')]).toEqual([
			503,
			'__Host-store_pass=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=lax'
		])
		expect(store.checkStorePass.mock.calls).toEqual([])
	})

	it('asks the engine about a confirmed pass again after a minute', async () => {
		vi.useFakeTimers({ now: new Date('2026-11-01T00:00:00Z') })
		try {
			const store = closedStore()
			store.checkStorePass.mockImplementation(async (token) => ({ token, expiresAt: new Date('2099-01-01T00:00:00Z') }))
			const ask = () => {
				const { event, next } = visit('https://acme.test/', { cookies: { '__Host-store_pass': 'minute-pass' } })
				return guardClosedStore(event, next)
			}
			await ask()
			vi.advanceTimersByTime(59_000)
			await ask()
			vi.advanceTimersByTime(2_000)
			await ask()
			expect(store.checkStorePass.mock.calls).toEqual([['minute-pass'], ['minute-pass']])
		} finally {
			vi.useRealTimers()
		}
	})

	it('lets a pass holder post to the page itself, and reads only a small lock form', async () => {
		const store = closedStore()
		store.checkStorePass.mockImplementation(async (token) => ({ token, expiresAt: new Date('2099-01-01T00:00:00Z') }))
		const holder = visit('https://acme.test/account', {
			method: 'POST',
			body: 'email=a%40b.co&password=their-own',
			cookies: { '__Host-store_pass': 'p' }
		})
		const passed = await guardClosedStore(holder.event, holder.next)
		expect([passed.status, await passed.text()]).toEqual([200, 'the page'])

		const json = visit('https://acme.test/', { method: 'POST', body: '{"password":"launch-day"}', type: 'application/json' })
		const huge = visit('https://acme.test/', { method: 'POST', body: `store_password=launch-day&pad=${'x'.repeat(5000)}` })
		for (const posted of [json, huge]) expect((await guardClosedStore(posted.event, posted.next)).status).toBe(503)
		expect(store.unlockStore.mock.calls).toEqual([])
	})

	it("lets the theme editor's genuine preview through, and nothing else with a key", async () => {
		closedStore()
		const getPageLayout = vi.fn(async (_page: string, _o: { preview: string }) => ({ preview: true }))
		svc.layoutService = { getPageLayout }
		const genuine = visit('https://acme.test/products/tee?preview=k')
		expect(await guardClosedStore(genuine.event, genuine.next)).toBe(genuine.page)
		expect(getPageLayout.mock.calls).toEqual([['product', { preview: 'k' }]])

		getPageLayout.mockResolvedValue({ preview: false })
		const stale = visit('https://acme.test/products/tee?preview=k')
		expect((await guardClosedStore(stale.event, stale.next)).status).toBe(503)
	})
})

describe('the lock helpers', () => {
	it('renders the lock page as deep as the address asked for', () => {
		expect(['/', '/sitemap.xml', '/robots.txt'].map((p) => lockPath(p))).toEqual(['/store-closed', '/store-closed', '/store-closed'])
		expect(lockPath('/a/b/c')).toBe('/store-closed/-/-')
		expect(lockPath('/products/tee', 'throttled')).toBe('/store-closed/-?reason=throttled')
	})

	it('returns to the same site, whatever the path', () => {
		expect(onSitePath(new URL('https://acme.test//evil.example/x?q=1'))).toBe('/evil.example/x?q=1')
		expect(onSitePath(new URL('https://acme.test/.//evil.example'))).toBe('/evil.example')
		expect(onSitePath(new URL('https://acme.test/products/tee?variant_id=3'))).toBe('/products/tee?variant_id=3')
	})

	it('names the page a preview key is for', () => {
		expect(previewPage(new URL('https://acme.test/products/tee?preview=k'))).toEqual({ page: 'product', key: 'k' })
		expect(previewPage(new URL('https://acme.test/?preview=k&preview_page=footer'))).toEqual({ page: 'footer', key: 'k' })
		expect(previewPage(new URL('https://acme.test/my/orders/42?preview=k&preview_page=header'))).toBeNull()
		expect(previewPage(new URL('https://acme.test/?preview=k'))).toEqual({ page: 'home', key: 'k' })
		expect(previewPage(new URL('https://acme.test/collections/rings?preview=k'))).toEqual({ page: 'collection', key: 'k' })
		expect(previewPage(new URL('https://acme.test/pages/about?preview=k'))).toBeNull()
		expect(previewPage(new URL('https://acme.test/products/tee'))).toBeNull()
	})
})

describe('the lock route', () => {
	const loadAt = (href: string, isSubRequest = true) => load({ isSubRequest, url: new URL(href) } as unknown as Parameters<typeof load>[0])

	it('is not a page anyone can open', async () => {
		expect(await thrown(Promise.resolve().then(() => loadAt('https://acme.test/store-closed', false)))).toMatchObject({ status: 404 })
	})

	it('says why a password was refused, from its own words only', () => {
		expect(loadAt('https://acme.test/store-closed?reason=wrong')).toEqual({ error: "That password isn't right." })
		expect(loadAt('https://acme.test/store-closed?reason=throttled')).toEqual({ error: 'Too many tries. Wait a while and try again.' })
		expect(loadAt('https://acme.test/store-closed?reason=unavailable')).toEqual({ error: "We couldn't check that password. Try again." })
		expect(loadAt('https://acme.test/store-closed?reason=stopped')).toEqual({
			error: 'This store has stopped asking for a password. Reload the page in a minute.'
		})
		expect(loadAt('https://acme.test/store-closed?reason=%3Cb%3E')).toEqual({ error: null })
		expect(loadAt('https://acme.test/store-closed')).toEqual({ error: null })
	})
})

describe('the lock page', () => {
	const draw = (closed: { message: string; password: boolean }, error: string | null = null) =>
		render(LockPage, { data: { store: { name: 'Acme', closed }, error } } as never)

	it('shows the message as text, line breaks kept', () => {
		const { container } = draw({ message: '<b>Soon</b>\nMay', password: false })
		const message = container.querySelector('p.whitespace-pre-line')
		expect(message?.textContent).toBe('<b>Soon</b>\nMay')
		expect(container.querySelector('b')).toBeNull()
		expect(screen.getByRole('heading', { level: 1 }).textContent?.trim()).toBe('Acme')
		expect(container.querySelector('form')).toBeNull()
	})

	it('asks for the password when the store has one', () => {
		const { container } = draw({ message: 'Launching soon', password: true })
		const input = screen.getByLabelText('Password')
		expect([input.getAttribute('type'), input.getAttribute('name'), input.getAttribute('autocomplete')]).toEqual([
			'password',
			'store_password',
			'current-password'
		])
		expect(input.getAttribute('aria-invalid')).toBeNull()
		expect(container.querySelector('form')?.getAttribute('method')).toBe('POST')
		expect(screen.getByRole('button').textContent?.trim()).toBe('Enter')
	})

	it('puts a refusal next to the field', () => {
		draw({ message: 'Launching soon', password: true }, "That password isn't right.")
		const input = screen.getByLabelText('Password')
		expect(input.getAttribute('aria-invalid')).toBe('true')
		expect(document.getElementById(input.getAttribute('aria-describedby') ?? '')?.textContent?.trim()).toBe("That password isn't right.")
	})

	it('draws the logo at a fixed size, named for the store', () => {
		render(LockPage, {
			data: { store: { name: 'Acme', logo: 'https://cdn.test/acme.png', closed: { message: '', password: false } }, error: null }
		} as never)
		const logo = screen.getByRole('img')
		expect([logo.getAttribute('alt'), logo.getAttribute('width'), logo.getAttribute('height')]).toEqual(['Acme', '192', '48'])
	})
})
