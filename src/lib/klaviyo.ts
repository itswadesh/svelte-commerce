// Lightweight Klaviyo onsite helper.
//
// The Klaviyo loader (klaviyo-plugin.svelte, driven by the store's `klaviyo` plugin or
// PUBLIC_KLAVIYO_COMPANY_ID) injects klaviyo.js plus the official queue shim, so calls
// made before the script loads are queued and replayed. Every function here is a safe
// no-op when Klaviyo isn't configured — same contract as analytics.ts for GA4.
//
// Event names follow Klaviyo's standard onsite metrics (Viewed Product, Added to Cart,
// Started Checkout, Placed Order) so built-in flows like abandoned cart work unchanged.

import { env } from '$env/dynamic/public'

type AnyRec = Record<string, any>

/**
 * Single source of truth for Klaviyo config: admin plugin settings win, env vars are
 * the fallback for stores that aren't configured through the admin yet.
 */
export function resolveKlaviyoConfig(plugins: AnyRec | undefined): {
	active: boolean
	companyId?: string
	listId?: string
} {
	const plugin = plugins?.klaviyo
	const companyId = plugin?.publicKey || plugin?.companyId || env.PUBLIC_KLAVIYO_COMPANY_ID
	return {
		// With plugin config present the admin toggle wins; env-only setups are implicitly active.
		active: !!companyId && (plugin ? !!plugin.active : true),
		companyId,
		listId: plugin?.listId || env.PUBLIC_KLAVIYO_LIST_ID
	}
}

function push(args: any[]): void {
	if (typeof window === 'undefined') return
	const w = window as any
	try {
		if (w.klaviyo?.push) w.klaviyo.push(args)
		// Shim not injected yet (Klaviyo inactive or loader hasn't run) — queue anyway;
		// klaviyo.js drains _klOnsite on init, and if it never loads this is inert.
		else (w._klOnsite = w._klOnsite || []).push(args)
	} catch {
		/* never let analytics break the app */
	}
}

function toItem(p: AnyRec, currency?: string): AnyRec {
	return {
		ProductID: p?.id ?? p?._id,
		SKU: p?.sku,
		ProductName: p?.title ?? p?.name,
		ItemPrice: p?.price,
		Quantity: p?.qty ?? 1,
		ImageURL: p?.thumbnail ?? p?.img,
		URL: typeof location !== 'undefined' && p?.slug ? `${location.origin}/products/${p.slug}` : undefined,
		Brand: p?.brandName ?? p?.brand?.name,
		Categories: [p?.category?.name ?? (typeof p?.category === 'string' ? p.category : undefined)].filter(Boolean),
		...(currency ? { Currency: currency } : {})
	}
}

/** Attach subsequent onsite activity to a Klaviyo profile. No-op without email or phone. */
export function klaviyoIdentify(props: { email?: string; firstName?: string; lastName?: string; phone?: string }): void {
	if (!props?.email && !props?.phone) return
	push([
		'identify',
		{
			...(props.email ? { $email: props.email } : {}),
			...(props.firstName ? { $first_name: props.firstName } : {}),
			...(props.lastName ? { $last_name: props.lastName } : {}),
			...(props.phone ? { $phone_number: props.phone } : {})
		}
	])
}

export function klaviyoTrackViewedProduct(product: AnyRec | undefined, currency?: string): void {
	if (!product) return
	const item = toItem(product, currency)
	push(['track', 'Viewed Product', { ...item, $value: product.price }])
	// Powers Klaviyo's "recently viewed items" blocks in emails.
	push([
		'trackViewedItem',
		{
			Title: item.ProductName,
			ItemId: item.ProductID,
			Categories: item.Categories,
			ImageUrl: item.ImageURL,
			Url: item.URL,
			Metadata: { Price: product.price }
		}
	])
}

export function klaviyoTrackAddedToCart(product: AnyRec | undefined, qty = 1, cart?: AnyRec, currency?: string): void {
	if (!product) return
	push([
		'track',
		'Added to Cart',
		{
			$value: (product.price ?? 0) * (qty || 1),
			AddedItem: toItem({ ...product, qty: qty || 1 }, currency),
			ItemNames: (cart?.lineItems ?? [product]).map((p: AnyRec) => p?.title ?? p?.name).filter(Boolean),
			Items: (cart?.lineItems ?? []).map((p: AnyRec) => toItem(p, currency)),
			...(currency ? { Currency: currency } : {})
		}
	])
}

/** The event Klaviyo's abandoned-checkout flows key on. Identify the shopper first when possible. */
export function klaviyoTrackStartedCheckout(cart: AnyRec | undefined, currency?: string): void {
	if (!cart?.lineItems?.length) return
	push([
		'track',
		'Started Checkout',
		{
			$event_id: `${cart.id ?? 'cart'}_${Date.now()}`,
			$value: cart.total,
			ItemNames: cart.lineItems.map((p: AnyRec) => p?.title ?? p?.name).filter(Boolean),
			CheckoutURL: typeof location !== 'undefined' ? `${location.origin}/checkout/address` : undefined,
			Items: cart.lineItems.map((p: AnyRec) => toItem(p, currency)),
			...(currency ? { Currency: currency } : {})
		}
	])
}

/**
 * Subscribe an email to the configured Klaviyo list via the public client API
 * (browser-safe, no private key). Klaviyo records proper marketing consent, and the
 * list's own opt-in setting decides whether a confirmation email goes out first.
 * Resolves false (never throws) when Klaviyo/list isn't configured or the call fails.
 */
export async function klaviyoSubscribe(
	email: string,
	config: { active?: boolean; companyId?: string; listId?: string },
	source = 'Footer newsletter'
): Promise<boolean> {
	if (typeof window === 'undefined') return false
	if (!config?.active || !config.companyId || !config.listId) return false
	if (!/^\S+@\S+\.\S+$/.test(email || '')) return false
	try {
		const res = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(config.companyId)}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', revision: '2024-10-15' },
			body: JSON.stringify({
				data: {
					type: 'subscription',
					attributes: {
						custom_source: source,
						profile: { data: { type: 'profile', attributes: { email } } }
					},
					relationships: { list: { data: { type: 'list', id: config.listId } } }
				}
			})
		})
		// Klaviyo answers 202 Accepted with an empty body.
		return res.ok
	} catch {
		return false
	}
}

export function klaviyoTrackPlacedOrder(order: AnyRec | undefined, currency?: string): void {
	if (!order) return
	push([
		'track',
		'Placed Order',
		{
			// Klaviyo dedupes on $event_id, so a page refresh can't double-count the order.
			$event_id: String(order.orderNo ?? order.id),
			$value: order.amount?.total ?? order.total,
			OrderId: order.orderNo ?? order.id,
			Categories: [...new Set((order.lineItems ?? []).map((p: AnyRec) => p?.category?.name).filter(Boolean))],
			ItemNames: (order.lineItems ?? []).map((p: AnyRec) => p?.title ?? p?.name).filter(Boolean),
			Items: (order.lineItems ?? []).map((p: AnyRec) => toItem(p, currency)),
			...(currency ? { Currency: currency } : {})
		}
	])
}
