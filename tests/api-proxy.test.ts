import { describe, it, expect, vi } from 'vitest'
import { isApiPath, proxyApiRequest } from '$lib/server/api-proxy'

const API = 'https://api.litekart.in'

describe('isApiPath', () => {
	it('matches /api and everything under it, nothing else', () => {
		expect(isApiPath('/api')).toBe(true)
		expect(isApiPath('/api/menu')).toBe(true)
		expect(isApiPath('/apical-ring')).toBe(false)
		expect(isApiPath('/products/api')).toBe(false)
	})
})

describe('proxyApiRequest', () => {
	it('forwards path, query and the store cookie to the backend', async () => {
		const fetchFn = vi.fn<typeof fetch>(async () => new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } }))
		const request = new Request('https://demo.litekart.in/api/products?limit=2', {
			headers: { cookie: 'litekart_store_id=store_1', host: 'demo.litekart.in', 'cf-ray': 'abc', 'cdn-loop': 'cloudflare' }
		})

		const response = await proxyApiRequest(request, API, fetchFn)

		const [target, init] = fetchFn.mock.calls[0] as [string, RequestInit]
		expect(target).toBe('https://api.litekart.in/api/products?limit=2')
		const sent = new Headers(init.headers)
		expect(sent.get('cookie')).toBe('litekart_store_id=store_1')
		expect(sent.has('host')).toBe(false)
		expect(sent.has('cf-ray')).toBe(false)
		expect(sent.has('cdn-loop')).toBe(false)
		expect(response.status).toBe(200)
		expect(await response.json()).toEqual({ ok: true })
	})

	it('tolerates a trailing slash on the base URL', async () => {
		const fetchFn = vi.fn<typeof fetch>(async () => new Response('{}'))
		await proxyApiRequest(new Request('https://demo.litekart.in/api/menu'), `${API}/`, fetchFn)
		expect(fetchFn.mock.calls[0][0]).toBe('https://api.litekart.in/api/menu')
	})

	it('forwards the body and method of a write', async () => {
		const fetchFn = vi.fn<typeof fetch>(async () => new Response('{}', { status: 201 }))
		const request = new Request('https://demo.litekart.in/api/carts/add-to-cart', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ productId: 'p1', qty: 1 })
		})

		const response = await proxyApiRequest(request, API, fetchFn)

		const init = fetchFn.mock.calls[0][1] as RequestInit
		expect(init.method).toBe('POST')
		expect(await new Response(init.body).json()).toEqual({ productId: 'p1', qty: 1 })
		expect(response.status).toBe(201)
	})

	it('passes backend errors through untouched', async () => {
		const fetchFn = vi.fn<typeof fetch>(
			async () => new Response('{"message":"Store ID is required"}', { status: 400, headers: { 'content-type': 'application/json' } })
		)
		const response = await proxyApiRequest(new Request('https://demo.litekart.in/api/menu'), API, fetchFn)
		expect(response.status).toBe(400)
		expect(response.headers.get('content-type')).toBe('application/json')
	})

	it('answers 502 JSON when the backend is unreachable', async () => {
		const fetchFn = vi.fn<typeof fetch>(async () => {
			throw new TypeError('fetch failed')
		})
		const response = await proxyApiRequest(new Request('https://demo.litekart.in/api/menu'), API, fetchFn)
		expect(response.status).toBe(502)
		expect(response.headers.get('content-type')).toBe('application/json')
	})
})
