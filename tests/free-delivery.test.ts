import { beforeEach, describe, expect, it, vi } from 'vitest'

const svc = vi.hoisted(() => ({ cartService: {} as Record<string, unknown> }))
vi.mock('$lib/core/services', () => svc)
vi.mock('$lib/utils/price', () => ({ formatPrice: (n: number) => `₹${n}` }))
vi.mock('$lib/motion', () => ({ fade: () => ({ duration: 0 }) }))

const { askFreeDelivery } = await import('$lib/components/cart/free-delivery-bar.svelte')

beforeEach(() => {
	svc.cartService = {}
})

describe('askFreeDelivery', () => {
	it('is null from a connector with no free-delivery answer', async () => {
		expect(await askFreeDelivery('IN')).toBeNull()
	})

	it("asks for the bag's country, or for none", async () => {
		const getFreeShipping = vi.fn(async () => ({ qualifies: true, threshold: null, remaining: null, subtotal: 25 }))
		svc.cartService = { getFreeShipping }
		expect(await askFreeDelivery('IN')).toMatchObject({ qualifies: true })
		await askFreeDelivery('')
		expect(getFreeShipping.mock.calls).toEqual([[{ country: 'IN' }], [{}]])
	})

	it('reads a failed request as no answer, so a step never claims free delivery it was not told', async () => {
		svc.cartService = { getFreeShipping: async () => Promise.reject(new Error('offline')) }
		expect(await askFreeDelivery()).toBeNull()
	})
})
