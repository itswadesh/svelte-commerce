import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { services } from 'kitcommerce.config'
import WhatsappOptin from '$lib/components/checkout/whatsapp-optin.svelte'
import { loadWhatsappOffer, saveWhatsappConsent } from '$lib/whatsapp'

// The checkbox only needs `cn` from core's utils, which otherwise pulls in SvelteKit's router.
vi.mock('$lib/core/utils', () => ({ cn: (...c: unknown[]) => c.filter(Boolean).join(' ') }))

// jsdom has no Web Animations; the box fades in, so give Svelte's transition an animation that ends.
Element.prototype.animate ??= function () {
	const a = { onfinish: null as null | (() => void), cancel() {}, currentTime: 0, effect: null }
	queueMicrotask(() => a.onfinish?.())
	return a as unknown as Animation
}

const svc = services as Record<string, unknown>

afterEach(() => {
	delete svc.whatsappService
	vi.restoreAllMocks()
})

describe('the WhatsApp opt-in at checkout', () => {
	it('offers both boxes, unticked, when the store sends order updates and reminders', async () => {
		render(WhatsappOptin, { storeName: 'Test shop', offer: { enabled: true, marketing: true } })
		const updates = await screen.findByRole('checkbox', { name: 'Get order updates from Test shop on WhatsApp' })
		const offers = screen.getByRole('checkbox', { name: 'Also send me offers and basket reminders on WhatsApp' })
		expect(updates.getAttribute('aria-checked')).toBe('false')
		expect(offers.getAttribute('aria-checked')).toBe('false')
	})

	it('offers order updates alone when the store has no reminder template', async () => {
		render(WhatsappOptin, { storeName: 'Test shop', offer: { enabled: true, marketing: false } })
		await screen.findByRole('checkbox', { name: /order updates/ })
		expect(screen.queryByRole('checkbox', { name: /basket reminders/ })).toBeNull()
	})

	it('draws nothing when the store does not send order updates', () => {
		const { container } = render(WhatsappOptin, { storeName: 'Test shop', offer: { enabled: false, marketing: false } })
		expect(container.querySelector('[data-testid="whatsapp-optin"]')).toBeNull()
	})

	it('is not offered when the store has WhatsApp off, the connector lacks it, or the engine fails', async () => {
		svc.whatsappService = { consentOffer: async () => ({ enabled: true, marketing: true }) }
		expect(await loadWhatsappOffer()).toEqual({ enabled: true, marketing: true })
		for (const service of [
			{ consentOffer: async () => ({ enabled: false, marketing: true }) },
			undefined,
			{
				consentOffer: async () => {
					throw new Error('boom')
				}
			}
		]) {
			svc.whatsappService = service
			expect(await loadWhatsappOffer()).toEqual({ enabled: false, marketing: false })
		}
	})
})

describe('sending the answer', () => {
	it('sends both boxes for the phone, and nothing without a phone', async () => {
		const setConsent = vi.fn(async () => ({}))
		svc.whatsappService = { setConsent }
		await saveWhatsappConsent({ cartId: 'cart_1', phone: ' 98765 43210 ', orderUpdates: true, marketing: false })
		await saveWhatsappConsent({ phone: '', orderUpdates: true, marketing: true })
		await saveWhatsappConsent({ phone: undefined, orderUpdates: true, marketing: true })
		expect(setConsent).toHaveBeenCalledTimes(1)
		expect(setConsent).toHaveBeenCalledWith({ cartId: 'cart_1', phone: '98765 43210', orderUpdates: true, marketing: false })
	})

	it('never stops checkout: a refused phone or a dead engine is logged and dropped', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		svc.whatsappService = {
			setConsent: async () => {
				throw Object.assign(new Error('not a WhatsApp number'), { status: 400 })
			}
		}
		await expect(saveWhatsappConsent({ phone: '12', orderUpdates: true, marketing: false })).resolves.toBeUndefined()
		expect(warn).toHaveBeenCalledTimes(1)
	})
})
