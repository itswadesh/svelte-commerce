import { describe, it, expect } from 'vitest'
import { productFailureStatus, watchProductRequest } from '$lib/product/product-load'

const respond = (status: number) => (async () => new Response('{}', { status })) as unknown as typeof fetch

describe('productFailureStatus', () => {
	it('is a 404 only when the product request itself answered 404', () => {
		expect(productFailureStatus(404)).toBe(404)
	})

	it('is a retryable 503 for every other failure', () => {
		expect(productFailureStatus(500)).toBe(503)
		expect(productFailureStatus(502)).toBe(503)
		expect(productFailureStatus('network')).toBe(503)
		expect(productFailureStatus(undefined)).toBe(503)
		expect(productFailureStatus(200)).toBe(503)
	})
})

describe('watchProductRequest', () => {
	it('records the status of the product request', async () => {
		const watch = watchProductRequest(respond(404), 'gold-ring')
		await watch.fetch('/api/products/gold-ring')
		expect(watch.outcome()).toBe(404)
	})

	it('ignores other requests, including sub-resources of the product', async () => {
		const watch = watchProductRequest(respond(500), 'gold-ring')
		await watch.fetch('/api/products/gold-ring/warehouse')
		await watch.fetch('/api/menu')
		await watch.fetch(new Request('https://shop.test/api/products/other-ring'))
		expect(watch.outcome()).toBeUndefined()
	})

	it('matches an encoded slug and a Request object', async () => {
		const watch = watchProductRequest(respond(200), 'bague-étoile')
		await watch.fetch(new Request('https://shop.test/api/products/bague-%C3%A9toile'))
		expect(watch.outcome()).toBe(200)
	})

	it('records a network failure and still throws it', async () => {
		const failing = (async () => {
			throw new TypeError('Failed to fetch')
		}) as unknown as typeof fetch
		const watch = watchProductRequest(failing, 'gold-ring')
		await expect(watch.fetch('/api/products/gold-ring')).rejects.toThrow('Failed to fetch')
		expect(watch.outcome()).toBe('network')
	})
})
