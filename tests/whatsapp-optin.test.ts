import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { services } from 'kitcommerce.config'
import WhatsappOptin from '$lib/components/checkout/whatsapp-optin.svelte'
import { saveWhatsappConsent } from '$lib/whatsapp'

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
		svc.whatsappService = { consentOffer: async () => ({ enabled: true, marketing: true }) }
		render(WhatsappOptin, { storeName: 'Test shop' })
		const updates = await screen.findByRole('checkbox', { name: 'Get order updates from Test shop on WhatsApp' })
		const offers = screen.getByRole('checkbox', { name: 'Also send me offers and basket reminders on WhatsApp' })
		expect(updates.getAttribute('aria-checked')).toBe('false')
		expect(offers.getAttribute('aria-checked')).toBe('false')
	})

	it('offers order updates alone when the store has no reminder template', async () => {
		svc.whatsappService = { consentOffer: async () => ({ enabled: true, marketing: false }) }
		render(WhatsappOptin, { storeName: 'Test shop' })
		await screen.findByRole('checkbox', { name: /order updates/ })
		expect(screen.queryByRole('checkbox', { name: /basket reminders/ })).toBeNull()
	})

	it('draws nothing when the store has WhatsApp off, the connector lacks it, or the engine fails', async () => {
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
			const { container, unmount } = render(WhatsappOptin, { storeName: 'Test shop' })
			await new Promise((r) => setTimeout(r, 0))
			expect(container.querySelector('[data-testid="whatsapp-optin"]')).toBeNull()
			unmount()
		}
	})
})

describe('sending the answer', () => {
	it('sends both boxes for the phone, and nothing without a phone', async () => {
		const setConsent = vi.fn(async () => ({}))
		svc.whatsappService = { setConsent }
		await saveWhatsappConsent(' 98765 43210 ', true, false)
		await saveWhatsappConsent('', true, true)
		await saveWhatsappConsent(undefined, true, true)
		expect(setConsent).toHaveBeenCalledTimes(1)
		expect(setConsent).toHaveBeenCalledWith({ phone: '98765 43210', orderUpdates: true, marketing: false })
	})

	it('never stops checkout: a refused phone or a dead engine is logged and dropped', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		svc.whatsappService = {
			setConsent: async () => {
				throw Object.assign(new Error('not a WhatsApp number'), { status: 400 })
			}
		}
		await expect(saveWhatsappConsent('12', true, false)).resolves.toBeUndefined()
		expect(warn).toHaveBeenCalledTimes(1)
	})
})
