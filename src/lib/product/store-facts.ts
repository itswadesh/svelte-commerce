/**
 * Facts about the store that the product page states, read from what the connector serves. Each
 * answers false when the connector has no such list or it cannot be read, so the page says nothing
 * it was not told.
 */
import { pageOffers, type BagOffer } from './upsells'

/** Whether the store takes cash on delivery: one of the payment methods it has switched on. */
export async function takesCashOnDelivery(services: object): Promise<boolean> {
	try {
		const listed: any = await (services as any).paymentMethodService?.list?.()
		return (listed?.data ?? []).some((m: any) => String(m?.code).toUpperCase() === 'COD')
	} catch {
		return false
	}
}

/**
 * The store's coupon codes for the page's Offers (Bewakoof study, 2026-11-25). Without a bag the
 * engine lists its order-wide codes, with one the bag's; a connector with no offers, or an engine
 * that cannot say, gives none.
 */
export function storeOffers(services: object): Promise<BagOffer[]> {
	const svc = (services as any).cartService as { getOffers?: () => Promise<BagOffer[]> } | undefined
	if (typeof svc?.getOffers !== 'function') return Promise.resolve([])
	return svc.getOffers().then(pageOffers, () => [])
}

/**
 * Whether a sold-out size may ask to be emailed when it is back (GoCommerce D248). The engine's
 * wishlist module writes to a list's address when a saved item returns, and only while the store's
 * "Ask for an email" setting is on, so the page offers it only then.
 */
export async function restockAlertsOn(services: object): Promise<boolean> {
	try {
		const s = services as any
		if (typeof s.wishlistService?.setEmail !== 'function') return false
		const listed: any = await s.pluginService?.list?.()
		const wishlist = (listed?.data ?? []).find((p: any) => p?.key === 'wishlist')
		return String(wishlist?.settings?.collect_email) === 'true'
	} catch {
		return false
	}
}

/**
 * Ask to be emailed when a sold-out variant is back: the address goes on the shopper's wishlist and
 * the variant is saved to it. A save of the product with no size, or another size, would not do:
 * the engine counts it as in stock while any of those is.
 */
export async function askRestockAlert(
	services: object,
	{ productId, variantId, email }: { productId: string; variantId?: string | null; email: string }
): Promise<void> {
	const wishlist = (services as any).wishlistService
	await wishlist.setEmail(email)
	const listed: any = await wishlist.fetchWishlist()
	const held = (listed?.data ?? []).find((i: any) => String(i?.productId) === String(productId))
	if (held && String(held.variantId ?? '') === String(variantId ?? '')) return
	// ponytail: the connector saves and unsaves by product, so a save of another size of this product
	// is swapped for this one. Keep both once the connector can add a variant without toggling.
	if (held) await wishlist.toggleWishlist({ productId })
	await wishlist.toggleWishlist({ productId, variantId })
}
