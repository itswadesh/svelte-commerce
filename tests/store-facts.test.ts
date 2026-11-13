import { describe, expect, it, vi } from 'vitest'
import { askRestockAlert, restockAlertsOn, takesCashOnDelivery } from '$lib/product/store-facts'

const methods = (...codes: string[]) => ({ paymentMethodService: { list: async () => ({ data: codes.map((code) => ({ code })) }) } })

describe('takesCashOnDelivery', () => {
	it('is true when cash on delivery is one of the switched-on methods', async () => {
		expect(await takesCashOnDelivery(methods('RAZORPAY', 'COD'))).toBe(true)
	})

	it('is false without it, from a connector with no list, or when the list fails', async () => {
		expect(await takesCashOnDelivery(methods('RAZORPAY'))).toBe(false)
		expect(await takesCashOnDelivery({})).toBe(false)
		expect(await takesCashOnDelivery({ paymentMethodService: { list: async () => Promise.reject(new Error('offline')) } })).toBe(false)
	})
})

const store = (settings: Record<string, unknown> | null, setEmail: unknown = async () => ({})) => ({
	wishlistService: { setEmail },
	pluginService: { list: async () => ({ data: settings ? [{ key: 'wishlist', settings }] : [] }) }
})

describe('restockAlertsOn', () => {
	it("follows the wishlist's ask-for-an-email setting", async () => {
		expect(await restockAlertsOn(store({ collect_email: true }))).toBe(true)
		expect(await restockAlertsOn(store({ collect_email: 'true' }))).toBe(true)
		expect(await restockAlertsOn(store({ heading: 'Your wishlist' }))).toBe(false)
	})

	it('is off without the wishlist module, or a connector that cannot keep an address', async () => {
		expect(await restockAlertsOn(store(null))).toBe(false)
		expect(await restockAlertsOn(store({ collect_email: true }, null))).toBe(false)
	})
})

describe('askRestockAlert', () => {
	const wishlist = (held: { productId: string; variantId: string | null }[]) => {
		const calls: unknown[] = []
		const service = {
			setEmail: vi.fn(async (email: string) => calls.push(['email', email])),
			fetchWishlist: async () => ({ data: held }),
			toggleWishlist: vi.fn(async (q: unknown) => calls.push(['toggle', q]))
		}
		return { services: { wishlistService: service }, calls }
	}

	it('keeps the address and saves the sold-out size', async () => {
		const { services, calls } = wishlist([])
		await askRestockAlert(services, { productId: '7', variantId: '71', email: 'a@example.com' })
		expect(calls).toEqual([
			['email', 'a@example.com'],
			['toggle', { productId: '7', variantId: '71' }]
		])
	})

	it('leaves a save of the same size alone, since a second toggle would remove it', async () => {
		const { services, calls } = wishlist([{ productId: '7', variantId: '71' }])
		await askRestockAlert(services, { productId: '7', variantId: '71', email: 'a@example.com' })
		expect(calls).toEqual([['email', 'a@example.com']])
	})

	it('swaps a save of the whole product for the size, which is what the engine watches', async () => {
		const { services, calls } = wishlist([{ productId: '7', variantId: null }])
		await askRestockAlert(services, { productId: '7', variantId: '71', email: 'a@example.com' })
		expect(calls.slice(1)).toEqual([
			['toggle', { productId: '7' }],
			['toggle', { productId: '7', variantId: '71' }]
		])
	})
})
