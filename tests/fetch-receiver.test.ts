import { describe, it, expect } from 'vitest'
import { baseServiceIn, bindFetchReceiver } from '$lib/core/connectors/fetch-receiver'

// Stands in for the browser's native fetch, which throws "Illegal invocation" unless it is called
// with the global object as its receiver.
function nativeLikeFetch(this: unknown, url: string) {
	if (this !== undefined && this !== globalThis) throw new TypeError("Failed to execute 'fetch' on 'Window': Illegal invocation")
	return Promise.resolve(new Response(JSON.stringify({ url })))
}

// The connector's shape: the fetch is stored on the instance and called as a method.
class FakeBaseService {
	_fetch: typeof fetch
	constructor(fetchFn?: typeof fetch) {
		this._fetch = fetchFn || (nativeLikeFetch as unknown as typeof fetch)
	}
	async safeFetch(url: string, data?: RequestInit) {
		try {
			return await this._fetch(url, data)
		} catch {
			throw { message: 'Please check your internet connection and try again' }
		}
	}
}

describe('bindFetchReceiver', () => {
	it('reproduces the bug without the binding', async () => {
		class Unbound extends FakeBaseService {}
		await expect(new Unbound().safeFetch('/api/menu')).rejects.toEqual({ message: 'Please check your internet connection and try again' })
	})

	it('lets a stored native fetch run with the global as receiver', async () => {
		class Bound extends FakeBaseService {}
		bindFetchReceiver(Bound)
		const response = await new Bound().safeFetch('/api/menu')
		expect(await response.json()).toEqual({ url: '/api/menu' })
	})

	it('still uses a fetch that was passed in, and keeps the connector error handling', async () => {
		class Bound extends FakeBaseService {}
		bindFetchReceiver(Bound)
		const seen: string[] = []
		const custom = (async (url: string) => {
			seen.push(url)
			throw new TypeError('offline')
		}) as unknown as typeof fetch
		await expect(new Bound(custom).safeFetch('/api/cart')).rejects.toEqual({ message: 'Please check your internet connection and try again' })
		expect(seen).toEqual(['/api/cart'])
	})

	it('is a no-op for a connector without safeFetch, and safe to apply twice', async () => {
		class Other {}
		expect(() => bindFetchReceiver(Other)).not.toThrow()
		class Bound extends FakeBaseService {}
		bindFetchReceiver(Bound)
		bindFetchReceiver(Bound)
		const response = await new Bound().safeFetch('/api/x')
		expect(await response.json()).toEqual({ url: '/api/x' })
	})
})

describe('baseServiceIn', () => {
	it('finds the base class through the exported services when the base itself is not exported', () => {
		class MenuService extends FakeBaseService {}
		class CartService extends FakeBaseService {}
		const exports = { MenuService, CartService, menuService: new MenuService(), VERSION: '2.0.29' }
		expect(baseServiceIn(exports)).toBe(FakeBaseService)
	})

	it('prefers an exported BaseService, and returns undefined when nothing has safeFetch', () => {
		class Base {
			safeFetch() {}
		}
		expect(baseServiceIn({ BaseService: Base })).toBe(Base)
		class Plain {}
		expect(baseServiceIn({ Plain, n: 1 })).toBeUndefined()
	})
})
