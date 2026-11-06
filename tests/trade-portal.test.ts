import { describe, it, expect, vi } from 'vitest'
import { isEngineOnlyPath, isTradePortalRequest, tradeOffer, tradePortalRequest } from '$lib/server/trade-portal'

describe('what a store host forwards to the engine', () => {
	it('forwards what the portal calls', () => {
		for (const [method, path] of [
			['GET', '/portal'],
			['GET', '/portal/quick-order'],
			['GET', '/_panel/immutable/entry/start.js'],
			['GET', '/_panel/fonts/inter/inter.woff2'],
			['GET', '/x/b2b/me'],
			['POST', '/x/b2b/checkout'],
			['POST', '/x/b2b/leads'],
			['GET', '/x/b2b/availability'],
			['POST', '/x/identity/login'],
			['GET', '/api/store'],
			['GET', '/api/carts/abc-123'],
			['PATCH', '/api/carts/abc-123/line-items/7'],
			['DELETE', '/api/carts/abc-123/line-items/7'],
			['GET', '/api/checkout'],
			['GET', '/api/checkout/rates'],
			['GET', '/api/products/sku/RING-22K'],
			['GET', '/api/products/sku/RING%2F22K']
		]) {
			expect(isTradePortalRequest(method, path), `${method} ${path}`).toBe(true)
		}
	})

	it('never forwards the staff API or the engine\'s own routes', () => {
		for (const path of ['/api/admin', '/api/admin/orders', '/api/admin/x/b2b/companies', '/internal', '/internal/caddy/ask', '/internal/traefik']) {
			for (const method of ['GET', 'HEAD', 'POST', 'PATCH', 'PUT', 'DELETE']) {
				expect(isTradePortalRequest(method, path), `${method} ${path}`).toBe(false)
			}
		}
	})

	it('refuses a path that reads differently once the engine decodes it', () => {
		for (const path of [
			'/x/b2b/..%2f..%2fapi/admin/orders',
			'/x/b2b/%2e%2e/%2e%2e/api/admin/orders',
			'/portal/..%2finternal/traefik',
			'/x/b2b/..%5c..%5capi/admin',
			'/_panel/..%2F..%2Finternal',
			'/x/b2b/%E0%A4%A'
		]) {
			expect(isTradePortalRequest('GET', path), path).toBe(false)
		}
	})

	it('does not widen to other routes beside the ones named', () => {
		for (const [method, path] of [
			['POST', '/portal/quick-order'],
			['GET', '/portalish'],
			['GET', '/_app/immutable/x.js'],
			['GET', '/'],
			['GET', '/dash'],
			['GET', '/docs'],
			['GET', '/x/klaviyo/track'],
			['POST', '/api/store'],
			['POST', '/api/carts'],
			['POST', '/api/checkout/cod'],
			['GET', '/api/checkout/quote'],
			['GET', '/api/carts/abc/line-items/7'],
			['GET', '/api/products'],
			['GET', '/api/plugins']
		]) {
			expect(isTradePortalRequest(method, path), `${method} ${path}`).toBe(false)
		}
	})
})

describe('the /backend mount', () => {
	it('stops the engine-only paths, under any spelling', () => {
		for (const path of ['/api/admin', '/api/admin/orders', '//api/admin/orders', '/API/ADMIN/orders', '/internal', '/internal/traefik', '/api/%61dmin%2forders', '/x/..%2f..%2finternal', '/api%2fadmin/orders']) {
			expect(isEngineOnlyPath(path), path).toBe(true)
		}
	})

	it('leaves what the connector calls', () => {
		for (const path of ['/api/carts', '/api/products', '/api/products/sku/RING%2F22K', '/x/identity/login', '/media/1.png', '/api/administrators', '/internally']) {
			expect(isEngineOnlyPath(path), path).toBe(false)
		}
	})
})

describe('tradePortalRequest', () => {
	it('names the store itself, whatever the browser said, and keeps the session', () => {
		const request = new Request('https://acme.shopnx.in/x/b2b/me', {
			headers: { 'x-store': 'other', 'x-litekart-store': 'other', cookie: 'token=storefront', authorization: 'Bearer buyer' }
		})
		const sent = tradePortalRequest(request, 'acme').headers
		expect(sent.get('x-store')).toBe('acme')
		expect(sent.has('x-litekart-store')).toBe(false)
		expect(sent.has('cookie')).toBe(false)
		expect(sent.get('authorization')).toBe('Bearer buyer')
	})

	it('carries the body of a write', async () => {
		const request = new Request('https://acme.shopnx.in/x/b2b/leads', { method: 'POST', body: '{"name":"A"}', headers: { 'content-type': 'application/json' } })
		expect(await tradePortalRequest(request, 'acme').text()).toBe('{"name":"A"}')
	})
})

describe('tradeOffer', () => {
	it('reads the engine for that store, and remembers it', async () => {
		const fetchFn = vi.fn<typeof fetch>(async () => Response.json({ data: { companies: true, dealers: false } }))
		expect(await tradeOffer('http://engine:8080/', 'store-a', fetchFn)).toEqual({ companies: true, dealers: false })
		await tradeOffer('http://engine:8080/', 'store-a', fetchFn)
		expect(fetchFn).toHaveBeenCalledTimes(1)
		const [target, init] = fetchFn.mock.calls[0] as [string, RequestInit]
		expect(target).toBe('http://engine:8080/x/b2b/availability')
		expect((init.headers as Record<string, string>)['x-store']).toBe('store-a')
	})

	it('offers nothing when the engine has no such module, or does not answer', async () => {
		expect(await tradeOffer('http://engine:8080', 'store-b', async () => new Response('{}', { status: 404 }))).toEqual({ companies: false, dealers: false })
		expect(await tradeOffer('http://engine:8080', 'store-c', async () => Promise.reject(new Error('down')))).toEqual({ companies: false, dealers: false })
		expect(await tradeOffer(undefined, 'store-d')).toEqual({ companies: false, dealers: false })
		expect(await tradeOffer('http://engine:8080', undefined)).toEqual({ companies: false, dealers: false })
	})
})
