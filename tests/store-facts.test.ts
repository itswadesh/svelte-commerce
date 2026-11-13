import { describe, expect, it } from 'vitest'
import { takesCashOnDelivery } from '$lib/product/store-facts'

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
