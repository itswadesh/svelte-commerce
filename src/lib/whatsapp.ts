/**
 * WhatsApp order updates at checkout (GoCommerce's ext/notify-whatsapp, through the connector).
 *
 * Both calls are extras on a checkout that must work without them: an older connector, another
 * backend or an engine without the module offers nothing, and a failed save is logged and dropped.
 */

export type WhatsappOffer = { enabled: boolean; marketing: boolean }

type WhatsappService = {
	consentOffer?: () => Promise<WhatsappOffer>
	setConsent?: (a: { cartId?: string; phone: string; orderUpdates: boolean; marketing: boolean }) => Promise<unknown>
}

const NONE: WhatsappOffer = { enabled: false, marketing: false }

// Reflect.get, as for Google reviews: a connector from before the service answers nothing instead of
// failing the build.
async function service(): Promise<WhatsappService | undefined> {
	const { services } = await import('kitcommerce.config')
	return Reflect.get(services as object, 'whatsappService') as WhatsappService | undefined
}

/** Which boxes the store offers: order updates, and offers and basket reminders under it. */
export async function loadWhatsappOffer(): Promise<WhatsappOffer> {
	try {
		const offer = await (await service())?.consentOffer?.()
		const enabled = offer?.enabled === true
		return { enabled, marketing: enabled && offer?.marketing === true }
	} catch {
		return NONE
	}
}

/**
 * Sends both answers for the phone, an unticked box as false: the engine keeps the latest answer per
 * phone, so that is how a shopper who said yes last time says no. Never throws.
 */
export async function saveWhatsappConsent({
	cartId,
	phone,
	orderUpdates,
	marketing
}: {
	cartId?: string
	phone: string | null | undefined
	orderUpdates: boolean
	marketing: boolean
}): Promise<void> {
	const typed = String(phone ?? '').trim()
	if (!typed) return
	try {
		await (await service())?.setConsent?.({ ...(cartId ? { cartId } : {}), phone: typed, orderUpdates, marketing })
	} catch (e) {
		console.warn('WhatsApp consent was not saved; checkout continues.', e)
	}
}
